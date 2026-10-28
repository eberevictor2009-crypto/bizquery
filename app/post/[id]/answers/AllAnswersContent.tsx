// app/post/[id]/answers/AllAnswersContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

export default function AllAnswersContent() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: postData } = await supabase.from('business_qa').select('title').eq('id', id).single();
      if (postData) setPost(postData);

      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('qa_id', id)
        .order('created_at', { ascending: false });

      if (answersData) setAnswers(answersData);
      setIsLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) return <div className="p-10 text-center">Loading answers...</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-blue-600 font-semibold hover:underline">
          ← Back to Question
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">All Answers</h1>
          <p className="text-gray-500">For: <span className="font-semibold text-gray-700">{post?.title}</span></p>
        </div>

        <div className="space-y-4">
          {answers.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
              No answers yet. Be the first to answer!
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {answer.author_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-800">{answer.author_name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(answer.created_at).toLocaleString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}