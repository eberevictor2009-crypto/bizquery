// app/post/[id]/page.tsx
import { Suspense } from 'react';
import PostContent from './PostContent';

export default function PostDetail() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading post...</div>}>
      <PostContent />
    </Suspense>
  );
}