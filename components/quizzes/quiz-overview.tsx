"use client";
import Link from "next/link";
import { Check, Gamepad2, Lock } from "lucide-react";
import { QUIZ_TITLES } from "@/data/quiz";
import { QuizModel } from "@/models/quiz";
import { useQuiz } from "@/hooks/use-quiz";
export default function QuizOverview() {
    const { state, ready } = useQuiz();
    return (
        <section className="rounded-[26px] bg-white/90 px-4 py-5 text-black backdrop-blur-sm">
            <h1 className="text-center text-3xl font-bold">Select Quizzes</h1>
            <p className="mt-2 text-center text-sm">
                Finish all questions in a quiz to unlock the next one.
            </p>
            {!ready ? (
                <p role="status" className="mt-4">
                    Loading quizzes…
                </p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((id) => {
                        const total = QuizModel.total(id);
                        const done = state.progress[id] ?? 0;
                        const unlocked = QuizModel.unlocked(id, state);
                        const complete = total > 0 && done >= total;
                        const content = (
                            <>
                                <span className="flex items-center gap-2">
                                    <Gamepad2 aria-hidden="true" className="size-6 shrink-0" />
                                    <span>
                                        Lesson {id}
                                        {QUIZ_TITLES[id] && (
                                            <span className="block text-xs font-normal">
                                                {QUIZ_TITLES[id]}
                                            </span>
                                        )}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1 text-xs">
                                    {complete ? (
                                        <Check aria-hidden="true" className="size-5" />
                                    ) : (
                                        !unlocked && <Lock aria-hidden="true" className="size-4" />
                                    )}
                                    {!total
                                        ? "Coming soon"
                                        : unlocked
                                            ? `${done}/${total} answered`
                                            : "Locked"}
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
            )}
        </section>
    );
}
