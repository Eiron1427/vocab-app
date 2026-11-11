"use client";
import Link from "next/link";
import { Check, Gamepad2, Lock } from "lucide-react";
import { QuizModel } from "@/models/quiz";
import { useQuiz } from "@/hooks/use-quiz";
import { useAppState } from "@/hooks/use-app-state";
export default function QuizOverview() {
    const { state, ready } = useQuiz();
    const { state: app, ready: appReady } = useAppState();
    const ageGroup = app.profile.ageGroup;
    const lessons = QuizModel.lessons(ageGroup);
    return (
        <section className="rounded-[26px] bg-white/90 px-4 py-5 text-black backdrop-blur-sm">
            <h1 className="text-center text-3xl font-bold">Select Quizzes</h1>
            <p className="mt-2 text-center text-sm">
                Complete a lesson to unlock its quiz.
            </p>
            <Link
                href="/quizzes/community"
                className="mt-4 flex min-h-14 items-center justify-between gap-3 rounded-xl bg-purple-100 px-4 py-3 font-bold text-purple-900 focus-visible:outline-2 focus-visible:outline-purple-700"
            >
                <span>
                    Community Quizzes
                    <span className="block text-xs font-normal">Practice with approved Author Studio questions</span>
                </span>
                <span aria-hidden="true">→</span>
            </Link>
            {!ready || !appReady ? (
                <p role="status" className="mt-4">
                    Loading quizzes…
                </p>
            ) : !ageGroup ? (
                <p className="mt-4 text-sm">
                    Choose your learner age group in <Link href="/settings" className="font-bold text-purple-800 underline">Settings → Account</Link> to see your lesson quizzes.
                </p>
            ) : lessons.length === 0 ? (
                <p className="mt-4 text-sm">No lesson quizzes are available for ages {ageGroup} yet.</p>
            ) : (
                <>
                    <h2 className="mt-4 font-bold">Lesson Quizzes · Ages {ageGroup}</h2>
                    <ul className="mt-4 space-y-3">
                        {lessons.map((lesson) => {
                            const id = String(lesson.id);
                            const total = QuizModel.total(id);
                            const done = state.progress[id] ?? 0;
                            const unlocked = QuizModel.unlocked(id, app);
                            const complete = total > 0 && done >= total;
                            const content = (
                                <>
                                    <span className="flex items-center gap-2">
                                        <Gamepad2 aria-hidden="true" className="size-6 shrink-0" />
                                        <span>{lesson.title}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        {complete ? (
                                            <Check aria-hidden="true" className="size-5" />
                                        ) : (
                                            !unlocked && <Lock aria-hidden="true" className="size-4" />
                                        )}
                                        {unlocked ? `${done}/${total} answered` : "Finish lesson first"}
                                    </span>
                                </>
                            );
                            const style =
                                "flex min-h-16 items-center justify-between gap-2 rounded-xl border border-black px-3 py-2 font-bold";
                            return (
                                <li key={id}>
                                    {unlocked ? (
                                        <Link
                                            href={`/quizzes/play?lesson=${id}`}
                                            className={`${style} ${complete ? "bg-[#c8f0c4]" : "bg-[#fde0b0]"} focus-visible:outline-2 focus-visible:outline-purple-700`}
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div
                                            aria-disabled="true"
                                            className={`${style} bg-neutral-200 text-neutral-600`}
                                        >
                                            {content}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </section>
    );
}
