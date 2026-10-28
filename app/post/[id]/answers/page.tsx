// app/post/[id]/answers/page.tsx
import { Suspense } from 'react';
import AllAnswersContent from './AllAnswersContent';

export default function AllAnswers() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading answers...</div>}>
      <AllAnswersContent />
    </Suspense>
  );
}