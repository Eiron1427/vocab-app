"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { CommunityQuizModel } from "@/models/community-quiz";
import type { Contribution } from "@/types/app-state";
import { panelStyle, primaryStyle, fieldStyle } from "@/components/ui/app-styles";

function QuizRound({ questions }: { questions: readonly Contribution[] }) {
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [checked, setChecked] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const item = questions[index];

    function check(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!item || checked !== null || !answer.trim()) return;
        const correct = CommunityQuizModel.matches(answer, item.answer);
        setChecked(correct);
        if (correct) setScore((value) => value + 1);
    }

    if (!item) {
        return (
            <div className="mt-5 rounded-2xl bg-orange-50 p-5">
                <h2 className="text-xl font-bold">Practice complete</h2>
                <p className="my-3" role="status">Score: {score} / {questions.length}</p>
                <button type="button" className={primaryStyle} onClick={() => {
                    setIndex(0);
                    setScore(0);
                }}>Try again</button>
            </div>
        );
    }

    return (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-purple-800">
                Question {index + 1} of {questions.length} · {item.category}
            </p>
            <form onSubmit={check} className="mt-3 space-y-3">
                <h2 className="whitespace-pre-wrap wrap-break-word text-xl font-bold">{item.question}</h2>
                <label htmlFor="community-answer" className="block font-semibold">Your answer</label>
                <input id="community-answer" value={answer} onChange={(event) => setAnswer(event.target.value)}
                    maxLength={100} required readOnly={checked !== null} autoComplete="off"
                    className={fieldStyle} />
                {checked === null && (
                    <button type="submit" disabled={!answer.trim()} className={primaryStyle}>Check answer</button>
                )}
            </form>
            {checked !== null && (
                <div className="mt-4 space-y-3">
                    <p role="status" className="wrap-break-word font-semibold">
                        {checked ? "Correct!" : <>Correct answer: {item.answer}</>}
                    </p>
                    <button type="button" className={primaryStyle} onClick={() => {
                        setIndex((value) => value + 1);
                        setAnswer("");
                        setChecked(null);
                    }}>{index + 1 === questions.length ? "See score" : "Next question"}</button>
                </div>
            )}
        </div>
    );
}

export default function CommunityQuiz() {
    const { state, ready } = useAppState();
    const questions = CommunityQuizModel.approved(state.contributions);
    // A changed question bank starts a fresh round so old answers never count
    // toward a different question.
    const roundKey = JSON.stringify(questions.map(({ id, category, question, answer }) => [id, category, question, answer]));
    return (
        <section className={panelStyle}>
            <Link href="/quizzes" className="inline-block py-3 font-bold text-purple-800">← Back to Quizzes</Link>
            <h1 className="mt-2 text-3xl font-extrabold">Community Quizzes</h1>
            <p className="mt-2 text-sm text-stone-600">Practice with questions from Author Studio that an admin has approved.</p>
            {!ready ? <p className="mt-5" role="status">Loading questions…</p>
                : questions.length ? <QuizRound key={roundKey} questions={questions} />
                    : <p className="mt-5 rounded-2xl bg-orange-50 p-4">No approved questions yet. Once an admin approves a question, it will appear here.</p>}
        </section>
    );
}
