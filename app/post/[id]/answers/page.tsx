// app/post/[id]/answers/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
import AllAnswersContent from './AllAnswersContent';

// ✅ Now valid because this is a Server Component
export const instant = false;

export default async function AllAnswers() {
  await connection();

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading answers...</div>}>
      <AllAnswersContent />
    </Suspense>
  );
}