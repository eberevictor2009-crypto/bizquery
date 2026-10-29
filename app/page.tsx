// app/page.tsx
'use client';
import { useEffect, useState, Fragment } from 'react';
import { supabase } from './lib/supabaseClient';
import { getUserId } from './lib/user';
import CreatePost from './components/CreatePost';
import AdBanner from './components/AdBanner';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface Post {
  id: number; // ✅ Changed from string to number to match int8 in Supabase
  title: string;
  content: string;
  type: string;
  category: string;
  author_name: string;
  created_at: string;
  answerCount?: number;
  viewCount?: number;
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = getUserId();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Track UNIQUE DAILY site visits
  useEffect(() => {
    const trackVisit = async () => {
      if (user === undefined) return;

      const visitorId = user ? user.id : currentUserId;
      
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      try {
        const { data } = await supabase
          .from('site_visits')
          .select('id')
          .eq('viewer_id', visitorId)
          .gte('visited_at', todayStart.toISOString())
          .limit(1);

        if (!data || data.length === 0) {
          await supabase.from('site_visits').insert([
            { viewer_id: visitorId }
          ]);
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };
    
    trackVisit();
  }, [user, currentUserId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); 
    router.refresh();
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    
    const { data: postsData, error } = await supabase
      .from('business_qa')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && postsData) {
      const postsWithCounts = await Promise.all(postsData.map(async (post) => {
        const { data: views } = await supabase
          .from('post_views')
          .select('viewer_id')
          .eq('post_id', post.id);
          
        const uniqueViews = new Set(views?.map(v => v.viewer_id).filter(Boolean));
        
        const { count } = await supabase
          .from('answers')
          .select('*', { count: 'exact', head: true })
          .eq('qa_id', post.id);
        
        return { ...post, answerCount: count || 0, viewCount: uniqueViews.size };
      }));

      setPosts(postsWithCounts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [pathname]); 

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* ✅ UPDATED HEADER SECTION FOR MOBILE FIX */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 relative">
          
          {/* Auth Buttons - Order 1 on mobile, Order 2 on desktop */}
          <div className="flex gap-4 items-center order-1 md:order-2">
            {user ? (
              <>
                <span className="text-sm font-bold text-gray-700">Hello, {user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="text-red-600 font-bold hover:underline">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-green-600 font-bold hover:underline">
                  Log In
                </Link>
                <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Logo & Tagline - Order 2 on mobile, Order 1 on desktop */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-5xl font-extrabold text-green-600 mb-2">BizQuery</h1>
            <p className="text-gray-500 text-lg">Ask, Get Answers and Grow Your Business</p>
          </div>

        </div>

        <CreatePost onPostCreated={fetchPosts} user={user} />

        {/* TOP BANNER AD PLACED HERE */}
        <AdBanner variant="horizontal" />

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading feed...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to ask a question!</p>
          ) : (
            posts.map((post, index) => {
              const isArticle = post.type === 'article';
              
              return (
                <Fragment key={post.id}>
                  <div 
                    className={`p-6 rounded-xl shadow-sm border-l-4 transition-colors ${
                      isArticle 
                        ? 'bg-white border-green-500 text-gray-800' 
                        : 'bg-black border-green-500 text-white'      
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        isArticle ? 'bg-green-50 text-green-700' : 'bg-gray-800 text-green-400'
                      }`}>
                        {post.category}
                      </span>
                      <span className={`text-xs ${isArticle ? 'text-gray-400' : 'text-gray-400'}`}>
                        {isArticle ? '📖 Guide by Admin' : `❓ Asked by ${post.author_name}`}
                      </span>
                    </div>

                    {/* ✅ Added String() casting just to be safe with Next.js routing */}
                    <Link href={`/post/${String(post.id)}`}>
                      <h2 className={`text-2xl font-bold mb-2 transition-colors ${
                        isArticle ? 'text-gray-800 hover:text-green-600' : 'text-white hover:text-green-400'
                      }`}>
                        {post.title}
                      </h2>
                    </Link>

                    <p className={`line-clamp-3 ${isArticle ? 'text-gray-600' : 'text-gray-300'}`}>
                      {post.content}
                    </p>
                    
                    <div className={`mt-4 pt-4 border-t flex justify-between text-sm ${
                      isArticle ? 'border-gray-100 text-gray-500' : 'border-gray-800 text-gray-400'
                    }`}>
                      <div className="flex gap-4">
                        <Link href={`/post/${String(post.id)}/answers`} className={`font-semibold transition-colors ${
                          isArticle ? 'hover:text-green-600' : 'hover:text-green-400'
                        }`}>
                          💬 {post.answerCount} {post.answerCount === 1 ? 'Answer' : 'Answers'}
                        </Link>
                        <span>👁️ {post.viewCount} {post.viewCount === 1 ? 'View' : 'Views'}</span>
                      </div>
                      <span>
                        {new Date(post.created_at).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* IN-FEED AD PLACED HERE */}
                  {(index + 1) % 3 === 0 && (
                    <AdBanner variant="in-feed" />
                  )}
                </Fragment>
              );
            })
          )}
        </div>

        <div className="text-center mt-16 pb-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/about" className="text-gray-500 hover:text-green-600 transition-colors">About Us</Link>
          <Link href="/contact" className="text-gray-500 hover:text-green-600 transition-colors">Contact Us</Link>
          <Link href="/privacy-policy" className="text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</Link>
        </div>

        <div className="text-center pb-8 flex justify-center gap-6 border-t border-gray-200 pt-6">
          <a href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Admin Login</a>
          <span className="text-xs text-gray-300">|</span>
          <a href="/analytics" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Analytics</a>
        </div>

      </div>
    </main>
  );
}