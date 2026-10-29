// app/post/[id]/PostContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { getUserId } from '../../lib/user';

export default function PostContent() {
  const params = useParams();
  // Safely handle the ID (in case it's an array from the router)
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; 
  
  const router = useRouter();
  const currentUserId = getUserId();
  
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editAnswerContent, setEditAnswerContent] = useState('');

  const fetchData = async () => {
    if (!id) return; // Don't fetch if we don't have an ID yet
    setIsLoading(true);
    
    // Fetch Post
    const { data: postData, error: postError } = await supabase.from('business_qa').select('*').eq('id', id).single();
    if (postData) {
      setPost(postData);
      setEditPostContent(postData.content);
    }
    if (postError) console.error("Error fetching post:", postError);

    // Fetch Answers
    const { data: answersData, error: answersError } = await supabase.from('answers').select('*').eq('qa_id', id).order('created_at', { ascending: true });
    if (answersData) setAnswers(answersData);
    if (answersError) console.error("Error fetching answers:", answersError);

    setIsLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | BizQuery`;
    }
  }, [post]);

  // Track views
  useEffect(() => {
    const trackView = async () => {
      if (!id || user === undefined) return;
      const viewerId = user ? user.id : currentUserId;
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      try {
        const { data } = await supabase
          .from('post_views')
          .select('id')
          .eq('post_id', id)
          .eq('viewer_id', viewerId)
          .gte('viewed_at', todayStart.toISOString())
          .limit(1);

        if (!data || data.length === 0) {
          await supabase.from('post_views').insert([{ post_id: id, viewer_id: viewerId }]);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    trackView();
  }, [id, user, currentUserId]);

  const handleSavePostEdit = async () => {
    await supabase.from('business_qa').update({ content: editPostContent }).eq('id', id);
    setIsEditingPost(false);
    fetchData();
  };

  const handleSaveAnswerEdit = async (answerId: string) => {
    await supabase.from('answers').update({ content: editAnswerContent }).eq('id', answerId);
    setEditingAnswerId(null);
    fetchData();
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !id) return;

    // 🚨 DEBUG: Check what the ID actually is
    alert(`The app is trying to use this ID: ${id}`);
    console.log("The ID type is:", typeof id, "Value:", id);

    const hasAlreadyAnswered = answers.some((ans) => ans.user_id === user?.id);
    if (hasAlreadyAnswered) {
      alert('You have already answered this question. Please edit your existing answer instead.');
      return;
    }

    const answerAuthor = user ? user.email.split('@')[0] : `Guest (${currentUserId.slice(-4)})`;

    const { data, error } = await supabase.from('answers').insert([{
      qa_id: id, // This is what is being sent to Supabase
      content: newAnswer.trim(),
      author_name: answerAuthor,
      user_id: user ? user.id : currentUserId,
    }]).select();

    if (error) {
      console.error("SUPABASE INSERT ERROR DETAILS:", error);
      alert(`Database Error: ${error.message} (Code: ${error.code})`);
      return;
    }

    setNewAnswer('');
    fetchData(); // Re-fetch to update the UI instantly
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center">Post not found.</div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: post.title,
      text: post.content,
      answerCount: answers.length,
      author: { '@type': 'Person', name: post.author_name },
      dateCreated: post.created_at,
      suggestedAnswer: answers.map((ans) => ({
        '@type': 'Answer',
        text: ans.content,
        author: { '@type': 'Person', name: ans.author_name },
        dateCreated: ans.created_at,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-6 text-green-600 font-semibold hover:underline">← Back to Feed</button>

        <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-green-500 mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase">{post.category}</span>
            <span className="text-sm text-gray-500">{post.author_name}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {isEditingPost ? (
            <div>
              <textarea 
                className="w-full border p-3 rounded-lg mb-2 h-32" 
                value={editPostContent} 
                onChange={(e) => setEditPostContent(e.target.value)} 
              />
              <div className="flex gap-2">
                <button onClick={handleSavePostEdit} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setIsEditingPost(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 text-lg whitespace-pre-wrap">{post.content}</p>
              
              {user && post.user_id === user.id && (
                <button onClick={() => setIsEditingPost(true)} className="mt-4 text-sm text-green-600 hover:underline">✏️ Edit Question</button>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{answers.length} Answers</h2>
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">👤 {answer.author_name}</span>
                  <span className="text-sm text-gray-400">{new Date(answer.created_at).toLocaleDateString()}</span>
                </div>

                {editingAnswerId === answer.id ? (
                  <div>
                    <textarea 
                      className="w-full border p-3 rounded-lg mb-2 h-24" 
                      value={editAnswerContent} 
                      onChange={(e) => setEditAnswerContent(e.target.value)} 
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveAnswerEdit(answer.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Save</button>
                      <button onClick={() => setEditingAnswerId(null)} className="bg-gray-300 text-black px-3 py-1 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">{answer.content}</p>
                    
                    {user && answer.user_id === user.id && (
                      <button 
                        onClick={() => { setEditingAnswerId(answer.id); setEditAnswerContent(answer.content); }} 
                        className="mt-2 text-xs text-green-600 hover:underline"
                      >
                        ✏️ Edit Answer
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea className="w-full border p-3 rounded-lg mb-4 h-32" placeholder="Share your business advice..." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} required />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">Post Answer</button>
          </form>
        </div>
      </div>
    </main>
  );
}