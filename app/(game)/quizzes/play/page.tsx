import { Suspense } from "react";
import QuizPlayer from '@/components/quizzes/quiz-player';

export default function QuizPage() {
  return (
    <Suspense fallback={<p>Loading quiz...</p>}><QuizPlayer /></Suspense>
  );
}