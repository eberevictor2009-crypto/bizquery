// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      setIsLoading(false);
      return;
    }

    // 2. Save the username to the public users table
    if (authData.user) {
      const { error: dbError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          username: username,
          email: email,
        },
      ]);

      if (dbError) {
        setErrorMsg('Account created, but failed to save profile: ' + dbError.message);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    alert('Signup successful! You can now log in.');
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-2">Join BizQuery</h1>
        <p className="text-gray-500 text-center mb-8">Create an account to ask and answer questions.</p>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="e.g., BusinessGuru"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}