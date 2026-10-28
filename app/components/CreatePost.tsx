// app/components/CreatePost.tsx
'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface CreatePostProps {
  onPostCreated: () => void;
  user: any;
  isAdmin?: boolean;
}

export default function CreatePost({ onPostCreated, user, isAdmin = false }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const postType = isAdmin ? 'article' : 'question';
    
    const userId = user ? user.id : 'guest_user';
    const authorName = isAdmin ? 'Admin' : (user ? user.email.split('@')[0] : 'Guest User');

    const { error } = await supabase.from('business_qa').insert([
      {
        title: title.trim(),
        content: content.trim(),
        type: postType,
        category: category,
        author_name: authorName,
        user_id: userId, 
      },
    ]);

    setIsSubmitting(false);
    if (!error) {
      setTitle('');
      setContent('');
      onPostCreated();
    } else {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {isAdmin ? '📖 Write an Official Guide' : '❓ Ask a Business Related Question'}
      </h2>
      <input type="text" placeholder="What is your question?" className="w-full border p-3 rounded-lg mb-4" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Provide more details..." className="w-full border p-3 rounded-lg mb-4 h-32" value={content} onChange={(e) => setContent(e.target.value)} required />
      
      <div className="flex justify-between items-center">
        {/* ✅ Expanded Category List */}
        <select 
          className="border p-2 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-green-500" 
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

        <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">
          {isSubmitting ? 'Posting...' : 'Post Question'}
        </button>
      </div>
    </form>
  );
}