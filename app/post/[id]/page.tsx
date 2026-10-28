// app/post/[id]/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
import PostContent from './PostContent';

export default async function PostDetail() {
  // ✅ Forces Next.js to skip prerendering this dynamic route at build time
  await connection(); 

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading post...</div>}>
      <PostContent />
    </Suspense>
  );
}