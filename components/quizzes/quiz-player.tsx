"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { QUIZZES } from "@/data/quiz";
import { QuizModel } from "@/models/quiz";
import { useQuiz } from "@/hooks/use-quiz";
import { quizService } from "@/lib/quiz-services";
import type { QuizSession } from "@/types/quiz";
const LETTERS = ["A", "B", "C", "D"];
export default function QuizPlayer() {
    const searchParams = useSearchParams();
    const id = searchParams.get("lesson") ?? "";
    const { state, ready } = useQuiz();
    if (!ready)
        return (
            <p role="status" className="rounded-2xl bg-white/90 p-6">
                Loading quiz…
            </p>
        );
    if (!QuizModel.total(id) || !QuizModel.unlocked(id, state))
        return (
            <section className="rounded-2xl bg-white/90 p-6 text-center">
                <h1 className="text-xl font-bold">
                    {QuizModel.total(id)
                        ? "Complete the previous quiz first"
                        : "Quiz not available yet"}
                </h1>
                <Link className="mt-4 block font-bold text-purple-800" href="/quizzes">
                    Back to quizzes
                </Link>
            </section>
        );
    return (
        <QuizSessionView
            key={id}
            id={id}
            initial={state.sessions[id] ?? { answered: 0, score: 0 }}
        />
    );
}
function Prompt({ text }: { text: string }) {
    return (
        <>
            {text.split("**").map((part, i) =>
                i % 2 === 1 ? (
                    <span key={i} className="text-[#3b0ca8]">
                        {part}
                    </span>
                ) : (
                    part
                ),
            )}
        </>
    );
}

function QuizSessionView({
    id,
    initial,
}: {
    id: string;
    initial: QuizSession;
}) {
    const [index, setIndex] = useState(initial.answered);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(initial.score);
    const [finished, setFinished] = useState(
        initial.answered >= QuizModel.total(id),
    );
    const [error, setError] = useState("");

    const questions = QUIZZES[id];
    const total = questions ? questions.length : 0;

    // ---------- Result screen (after the last question) ----------
    if (finished) {
        return (
            <section className="rounded-[26px] bg-white/90 p-6 text-center text-black">
                <div aria-hidden="true" className="text-6xl">
                    🎉
                </div>
                <h1 className="mt-4 text-2xl font-bold">Quiz complete!</h1>
                <p className="mt-3 text-xl">
                    Your score: {score}/{total}
                </p>
                <p className="mt-2">
                    {score === total
                        ? "Great work!"
                        : "Keep practising—you can try again."}
                </p>
                {error && (
                    <p role="alert" className="mt-3 text-red-700">
                        {error}
                    </p>
                )}
                <button
                    type="button"
                    className="mt-5 min-h-11 rounded-full bg-[#5b0ee0] px-6 py-2 font-bold text-white"
                    onClick={() => {
                        try {
                            quizService.restart(id);
                            setIndex(0);
                            setScore(0);
                            setSelected(null);
                            setSubmitted(false);
                            setFinished(false);
                            setError("");
                        } catch (error) {
                            setError(
                                error instanceof Error ? error.message : "Could not restart.",
                            );
                        }
                    }}
                >
                    Try again
                </button>
                <Link
                    href="/quizzes"
                    className="mt-4 block py-2 font-bold text-purple-800"
                >
                    Back to quizzes
                </Link>
            </section>
        );
    }

    // ---------- Question screen ----------
    const q = questions[index];
    const isLast = index === total - 1;

    function handleSelect(i: number) {
        if (!submitted) setSelected(i);
    }

    function handleSubmit() {
        if (selected === null || submitted) return;
        try {
            quizService.answer(id, index, selected);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not save your answer.",
            );
            return;
        }
        setError("");
        const newScore = selected === q.answer ? score + 1 : score;
        setSubmitted(true);
        setScore(newScore);
        // Save right away, so leaving now (back arrow, browser back, reload) keeps this answer.
    }

    function handleNext() {
        if (isLast) {
            setFinished(true);
        } else {
            setIndex(index + 1);
            setSelected(null);
            setSubmitted(false);
        }
    }

    function optionClass(i: number) {
        if (!submitted) {
            return selected === i
                ? "border-blue-600 bg-[#8d8df7]"
                : "border-black/80 bg-[#ffdcb0] hover:bg-[#fed0a0]";
        }
        if (i === q.answer) return "border-green-700 bg-[#b8efb4]";
        if (i === selected) return "border-red-700 bg-[#f7b4b4]";
        return "border-black/80 bg-[#ffdcb0] opacity-60";
    }

    return (
        <>
            <section className="relative flex min-h-120flex-1 flex-col rounded-[26px] bg-white/85 px-5 pb-6 pt-5 backdrop-blur-sm">
                <Link
                    href="/quizzes"
                    aria-label="Back to quizzes"
                    className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-black transition-transform hover:bg-neutral-300 active:scale-95"
                >
                    <ArrowLeft className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                </Link>

                <div className="px-5 pt-10 text-center">
                    <p className="mt-1 text-[12px] font-semibold text-neutral-600">
                        Question {index + 1} of {total}
                    </p>
                    <h1 className="mt-1 text-[22px] font-bold leading-tight text-black">
                        <Prompt text={q.prompt} />
                    </h1>
                </div>

                <div className="mt-5 space-y-3">
                    {q.options.map((option, i) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(i)}
                            disabled={submitted}
                            aria-pressed={selected === i}
                            className={`flex w-full items-center rounded-lg border p-1 text-left transition-colors active:scale-[0.99] ${optionClass(i)}`}
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1df0] text-[20px] font-bold text-white">
                                {LETTERS[i]}
                            </span>
                            <span className="flex-1 pr-10 text-center text-[20px] font-bold text-black">
                                {option}
                            </span>
                        </button>
                    ))}
                </div>

                <p
                    aria-live="polite"
                    className="mt-3 min-h-5 text-center text-[14px] font-semibold"
                >
                    {submitted &&
                        (selected === q.answer
                            ? "Correct!"
                            : `Not quite. The answer is ${q.options[q.answer]}.`)}
                </p>

                {error && (
                    <p role="alert" className="mt-3 text-center text-red-700">
                        {error}
                    </p>
                )}
                <div className="mt-auto pt-4 text-center">
                    {submitted ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full bg-[#5b0ee0] px-10 py-2 text-[20px] font-extrabold tracking-wide text-white transition-transform hover:bg-[#4d0bc4] active:scale-95"
                        >
                            {isLast ? "FINISH" : "NEXT"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selected === null}
                            className="rounded-full bg-[#5b0ee0] px-10 py-2 text-[20px] font-extrabold tracking-wide text-white transition-transform hover:bg-[#4d0bc4] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            SUBMIT
                        </button>
                    )}
                </div>
            </section>
        </>
    );
}


