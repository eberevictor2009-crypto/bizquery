// app/post/[id]/answers/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
import AllAnswersContent from './AllAnswersContent';

export default async function AllAnswers() {
  // ✅ Forces Next.js to skip prerendering this dynamic route at build time
  await connection(); 

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading answers...</div>}>
      <AllAnswersContent />
    </Suspense>
  );
}