// app/post/[id]/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
import PostContent from './PostContent';

// ✅ Tell Next.js this route is allowed to block during prerendering
export const instant = false;

export default async function PostDetail() {
  // ✅ Forces Next.js to skip static generation for this route
  await connection(); 

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading post...</div>}>
      <PostContent />
    </Suspense>
  );
}