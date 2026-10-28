// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Business'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [adminList, setAdminList] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const ADMIN_PASSWORD = 'BizQuery2026!'; 

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admins').select('*');
    if (data) setAdminList(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchAdmins();
    } else {
      alert('Incorrect Master Password');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', newAdminEmail)
      .maybeSingle();

    if (existingAdmin) {
      alert('This email is already an Admin!');
      return;
    }

    const { error } = await supabase.from('admins').insert([{ email: newAdminEmail }]);
    
    if (error) {
      alert('Error adding admin: ' + error.message);
    } else {
      alert(`Successfully granted Admin access to ${newAdminEmail}`);
      setNewAdminEmail('');
      fetchAdmins();
    }
  };

  const handleRemoveAdmin = async (adminId: string, email: string) => {
    const confirmRemove = window.confirm(`Are you sure you want to remove ${email} as an admin?`);
    
    if (confirmRemove) {
      const { error } = await supabase.from('admins').delete().eq('id', adminId);
      
      if (error) {
        alert('Error removing admin: ' + error.message);
      } else {
        fetchAdmins();
      }
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ 1. Check if the email field is empty
    if (!currentAdminEmail.trim()) {
      alert('Please enter your email address before publishing an article.');
      return;
    }

    // ✅ 2. Check if the entered email is actually in the approved admins list
    const isApprovedAdmin = adminList.some(
      (admin) => admin.email.toLowerCase() === currentAdminEmail.toLowerCase()
    );

    if (!isApprovedAdmin) {
      alert('Access Denied. This email is not registered as an Admin. Please contact the master admin.');
      return;
    }

    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase.from('business_qa').insert([
      {
        title: title.trim(),
        content: content.trim(),
        type: 'article',
        category: category,
        author_name: `Admin (${currentAdminEmail})`,
        user_id: 'admin_master_id', 
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert('Error posting: ' + error.message);
    } else {
      alert('Article Published Successfully!');
      setTitle('');
      setContent('');
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Master Password"
            className="w-full border p-3 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suppressHydrationWarning
          />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => router.push('/')} className="text-green-600 font-semibold hover:underline">
            Back to Home
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          {/* ✅ Updated Text */}
          <label className="block text-sm font-bold text-green-800 mb-2">Who are you? (Enter your email to sign up your articles)</label>
          <input 
            type="email" 
            placeholder="e.g., boss@bizquery.com" 
            className="w-full border p-2 rounded"
            value={currentAdminEmail}
            onChange={(e) => setCurrentAdminEmail(e.target.value)}
            suppressHydrationWarning
          />
        </div>

        <form onSubmit={handleSubmitArticle} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
          <h2 className="text-xl font-bold mb-6 text-green-600">📖 Publish New Official Article</h2>
          
          <input
            type="text"
            placeholder="Article Title (e.g., 5 Ways to Fund Your Startup)"
            className="w-full border p-3 rounded-lg mb-4 text-lg font-semibold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your full article content here..."
            className="w-full border p-3 rounded-lg mb-4 h-64 text-gray-700"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-between items-center">
            <select
              className="border p-2 rounded-lg text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Business">Business</option>
              <option value="Startups">Startups</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Technology">Technology</option>
              <option value="Career">Career</option>
              <option value="Legal">Legal</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-green-600">👑 Manage Admins</h2>
          <p className="text-gray-600 mb-4 text-sm">Add team members who are allowed to write articles.</p>
          
          <form onSubmit={handleAddAdmin} className="flex gap-2 mb-6">
            <input
              type="email"
              placeholder="Enter new admin email..."
              className="flex-1 border p-3 rounded-lg"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
              suppressHydrationWarning
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
              Add Admin
            </button>
          </form>

          <h3 className="font-bold text-gray-700 mb-2">Current Admins:</h3>
          <ul className="space-y-2">
            {adminList.map((admin) => (
              <li key={admin.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{admin.email}</span>
                  <span className="text-xs text-gray-400 ml-2">Joined {new Date(admin.created_at).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Remove Admin"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}