// app/post/[id]/answers/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
import AllAnswersContent from './AllAnswersContent';

export default async function AllAnswers() {
  await connection(); 

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading answers...</div>}>
      <AllAnswersContent />
    </Suspense>
  );
}