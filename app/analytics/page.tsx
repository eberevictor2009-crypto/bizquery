// app/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [totalViews, setTotalViews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [postStats, setPostStats] = useState<any[]>([]);

  const [totalSiteVisits, setTotalSiteVisits] = useState(0);
  const [todaySiteVisits, setTodaySiteVisits] = useState(0);

  const ADMIN_PASSWORD = 'BizQuery2026!'; 

  const fetchAnalytics = async () => {
    setIsLoading(true);

    // --- 1. POST VIEWS & USERS ---
    const { data: views } = await supabase.from('post_views').select('*');
    if (views) setTotalViews(views.length);

    if (views) {
      const uniqueUsers = new Set(views.map(v => v.viewer_id).filter(Boolean));
      setTotalUsers(uniqueUsers.size);
    }

    // --- 2. POST PERFORMANCE ---
    const { data: posts } = await supabase.from('business_qa').select('id, title');
    if (posts && views) {
      const stats = posts.map(post => {
        // Count unique views per post
        const uniqueViewers = new Set(
          views.filter(v => v.post_id === post.id).map(v => v.viewer_id).filter(Boolean)
        );
        return { ...post, viewCount: uniqueViewers.size };
      }).sort((a, b) => b.viewCount - a.viewCount); 
      setPostStats(stats);
    }

    // --- 3. SITE VISITS (UNIQUE) ---
    const { data: visits } = await supabase.from('site_visits').select('*');
    
    if (visits) {
      // Total site visits = Total unique daily users overall
      const uniqueTotalVisits = new Set(visits.map(v => v.viewer_id).filter(Boolean));
      setTotalSiteVisits(uniqueTotalVisits.size);

      // Calculate today's unique visits
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); 
      
      const todayVisits = visits.filter(v => new Date(v.visited_at) >= today);
      const uniqueToday = new Set(todayVisits.map(v => v.viewer_id).filter(Boolean));
      
      setTodaySiteVisits(uniqueToday.size);
    }

    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchAnalytics();
    } else {
      alert('Incorrect Master Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Analytics</h1>
          <input
            type="password"
            placeholder="Enter Master Password"
            className="w-full border p-3 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suppressHydrationWarning
          />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
            View Analytics
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 BizQuery Analytics</h1>
          <button onClick={() => router.push('/')} className="text-green-600 font-semibold hover:underline">
            Back to Home
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total Post Views</p>
                <p className="text-4xl font-extrabold text-green-600">{totalViews}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Unique Members</p>
                <p className="text-4xl font-extrabold text-green-600">{totalUsers}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total Site Visits</p>
                <p className="text-4xl font-extrabold text-green-600">{totalSiteVisits}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Visits Today</p>
                <p className="text-4xl font-extrabold text-green-600">{todaySiteVisits}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <h2 className="text-xl font-bold p-6 bg-gray-50 border-b border-gray-200">Post Performance</h2>
              <ul className="divide-y divide-gray-100">
                {postStats.map((post) => (
                  <li key={post.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-gray-800 text-lg">{post.title}</p>
                      <p className="text-sm text-gray-400">Post ID: {post.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase font-bold">Views</p>
                      <p className="text-2xl font-bold text-gray-800">{post.viewCount}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}