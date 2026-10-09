"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, PenLine, Plus, Check, Clock3 } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { authorService } from "@/lib/app-services";
import { QuestionModel } from "@/models/question";
import {
    CATEGORIES,
    type Category,
    type QuestionInput,
} from "@/types/app-state";
import {
    panelStyle,
    fieldStyle,
    primaryStyle,
    secondaryStyle,
} from "@/components/ui/app-styles";
const empty: QuestionInput = {
    id: "",
    category: "Emotions",
    question: "",
    answer: "",
};
type View = "dashboard" | "edit" | "preview" | "submitted";

export default function AuthorStudio() {
    const { state, ready } = useAppState();
    const [view, setView] = useState<View>("dashboard");
    const [form, setForm] = useState<QuestionInput>(empty);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const submitted = state.contributions.filter(
        (item) => item.status === "submitted",
    ).length;
    function go(next: View) {
        setError("");
        setNotice("");
        setView(next);
    }
    function start() {
        setForm({ ...empty, id: crypto.randomUUID() });
        go("edit");
    }
    function preview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const model = new QuestionModel(form);
        const message = model.validate();
        if (message) {
            setError(message);
            return;
        }
        setForm(model.normalized());
        go("preview");
    }
    function saveDraft() {
        setError("");
        setNotice("");
        try {
            authorService.save(form, "draft");
            setNotice("Draft saved on this device.");
        } catch (error) {
            setError((error as Error).message);
        }
    }
    function submit() {
        setError("");
        try {
            authorService.save(form, "submitted");
            go("submitted");
        } catch (error) {
            setError((error as Error).message);
        }
    }
    const heading = {
        dashboard: "Author Studio",
        edit: "Create a question",
        preview: "Preview question",
        submitted: "Question submitted",
    }[view];
    return (
        <section aria-labelledby="author-heading" className={panelStyle}>
            {view === "dashboard" ? (
                <Link
                    href="/settings"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-stone-700 focus-visible:outline-2"
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Settings
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={() => go(view === "preview" ? "edit" : "dashboard")}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-stone-700 focus-visible:outline-2"
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    {view === "preview" ? "Edit question" : "Author Studio"}
                </button>
            )}
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-purple-700">
                Share what you know
            </p>
            <h1
                id="author-heading"
                className="mt-1 text-3xl font-extrabold"
                aria-live="polite"
            >
                {heading}
            </h1>
            {!ready ? (
                <p className="mt-4" role="status">
                    Loading your contributions…
                </p>
            ) : (
                <>
                    <p className="my-4 text-sm text-stone-600">
                        Create and manage your vocabulary questions.
                    </p>
                    {error && (
                        <p
                            role="alert"
                            className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800"
                        >
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p
                            role="status"
                            className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800"
                        >
                            {notice}
                        </p>
                    )}
                    {view === "dashboard" && (
                        <>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-lg font-bold">My contributions</h2>
                                <p className="text-xs text-stone-600">
                                    {submitted} submitted ·{" "}
                                    {state.contributions.length - submitted} drafts
                                </p>
                            </div>
                            {!state.contributions.length ? (
                                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
                                    <PenLine
                                        size={30}
                                        className="mx-auto text-purple-700"
                                        aria-hidden="true"
                                    />
                                    <p className="mt-3 font-bold">
                                        Your first question starts here
                                    </p>
                                    <p className="mt-2 text-sm text-stone-600">
                                        Choose a category and share a simple vocabulary question.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {state.contributions.map((item) => (
                                        <li
                                            key={item.id}
                                            className="rounded-2xl border border-stone-200 bg-white p-4"
                                        >
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-bold ${item.status === "draft" ? "bg-stone-100 text-stone-700" : "bg-amber-100 text-amber-900"}`}
                                            >
                                                {item.status === "draft" ? "Draft" : "Submitted"}
                                            </span>
                                            <p className="mt-3 wrap-break-word font-bold">
                                                {item.question}
                                            </p>
                                            <p className="mt-2 text-xs text-stone-600">
                                                {item.category} ·{" "}
                                                {item.status === "submitted"
                                                    ? "Saved locally; not verified"
                                                    : "Not submitted"}
                                            </p>
                                            {item.status === "draft" && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm({
                                                            id: item.id,
                                                            category: item.category,
                                                            question: item.question,
                                                            answer: item.answer,
                                                        });
                                                        go("edit");
                                                    }}
                                                    className={`${secondaryStyle} mt-3 text-sm`}
                                                >
                                                    Continue editing
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                type="button"
                                onClick={start}
                                className={`${primaryStyle} mt-6 w-full`}
                            >
                                <Plus size={20} aria-hidden="true" />
                                Create a question
                            </button>
                        </>
                    )}
                    {view === "edit" && (
                        <form onSubmit={preview} className="space-y-5">
                            <div>
                                <label htmlFor="question-category" className="font-semibold">
                                    Category
                                </label>
                                <select
                                    id="question-category"
                                    value={form.category}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            category: event.target.value as Category,
                                        })
                                    }
                                    className={fieldStyle}
                                >
                                    {CATEGORIES.map((category) => (
                                        <option key={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="question-text" className="font-semibold">
                                    Your question
                                </label>
                                <textarea
                                    id="question-text"
                                    value={form.question}
                                    onChange={(event) => {
                                        setNotice("");
                                        setForm({ ...form, question: event.target.value });
                                    }}
                                    minLength={10}
                                    maxLength={500}
                                    required
                                    rows={4}
                                    aria-describedby="question-counter question-guide"
                                    placeholder="What is the opposite of happy?"
                                    className={`${fieldStyle} resize-y`}
                                />
                                <p
                                    id="question-counter"
                                    className="mt-1 text-right text-xs text-stone-600"
                                >
                                    {form.question.length}/500
                                </p>
                            </div>
                            <div>
                                <label htmlFor="question-answer" className="font-semibold">
                                    Correct answer
                                </label>
                                <input
                                    id="question-answer"
                                    value={form.answer}
                                    onChange={(event) => {
                                        setNotice("");
                                        setForm({ ...form, answer: event.target.value });
                                    }}
                                    required
                                    maxLength={100}
                                    aria-describedby="answer-counter"
                                    placeholder="Sad"
                                    className={fieldStyle}
                                />
                                <p
                                    id="answer-counter"
                                    className="mt-1 text-right text-xs text-stone-600"
                                >
                                    {form.answer.length}/100
                                </p>
                            </div>
                            <p
                                id="question-guide"
                                className="rounded-xl bg-orange-50 p-4 text-sm text-stone-700"
                            >
                                Use simple language and check spelling. Include one clear
                                question and answer. Check that your answer is correct before
                                submitting.
                            </p>
                            <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={saveDraft}
                                    className={secondaryStyle}
                                >
                                    Save draft
                                </button>
                                <button type="submit" className={primaryStyle}>
                                    Preview question
                                </button>
                            </div>
                            <p className="text-xs text-stone-600">
                                Save a draft before leaving this page to keep your work.
                            </p>
                        </form>
                    )}
                    {view === "preview" && (
                        <>
                            <article className="rounded-2xl border border-stone-300 bg-white p-5">
                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase text-purple-900">
                                    {form.category}
                                </span>
                                <h2 className="my-5 whitespace-pre-wrap wrap-break-word text-xl font-bold">
                                    {form.question}
                                </h2>
                                <div className="border-t border-stone-300 pt-4">
                                    <p className="mb-2 text-xs font-semibold text-stone-600">
                                        Answer provided by you
                                    </p>
                                    <p className="flex items-start gap-2 rounded-xl bg-green-50 p-3 font-bold text-green-800">
                                        <Check size={20} className="shrink-0" aria-hidden="true" />
                                        <span className="wrap-break-word">{form.answer}</span>
                                    </p>
                                </div>
                            </article>
                            <p className="my-5 text-sm text-stone-600">
                                Submitting saves this question in your local contribution list.
                                Verification and publishing will be added later.
                            </p>
                            <div className="grid gap-3">
                                <button
                                    type="button"
                                    onClick={() => go("edit")}
                                    className={secondaryStyle}
                                >
                                    Edit question
                                </button>
                                <button type="button" onClick={submit} className={primaryStyle}>
                                    Submit question
                                </button>
                            </div>
                        </>
                    )}
                    {view === "submitted" && (
                        <div className="py-5 text-center">
                            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#ffe183]">
                                <Clock3 size={36} aria-hidden="true" />
                            </div>
                            {state.notifications && (
                                <h2 className="mt-5 text-2xl font-bold">Thanks for sharing!</h2>
                            )}
                            <p className="mt-3 text-stone-700">
                                Your question was saved on this device.
                            </p>
                            <p className="mt-2 text-sm text-stone-600">
                                It has not been sent for verification or added to quizzes.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setForm(empty);
                                    go("dashboard");
                                }}
                                className={`${primaryStyle} mt-7 w-full`}
                            >
                                Back to Author Studio
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
