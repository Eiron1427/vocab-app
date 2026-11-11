"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/hooks/use-app-state";
import { adminService } from "@/lib/app-services";
import type { Contribution } from "@/types/app-state";
import { panelStyle, primaryStyle, secondaryStyle, fieldStyle } from "@/components/ui/app-styles";
function ReviewCard({ item }: { item: Contribution }) {
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    function decide(decision: "approved" | "returned") {
        try { adminService.review(item.id, item.updatedAt, decision, note); }
        catch (e) { setError(e instanceof Error ? e.message : "Could not save review."); }
    }
    return <article className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-xs font-bold text-purple-800">{item.category} · {item.status === "submitted" ? "Pending" : item.status === "approved" ? "Approved" : "Draft"}</p>
        <h2 className="mt-2 whitespace-pre-wrap wrap-break-word text-lg font-bold">{item.question}</h2>
        <p className="mt-2 wrap-break-word"><span className="font-bold">Answer: </span>{item.answer}</p>
        {item.review && <div className="mt-3 rounded-xl bg-orange-50 p-3 text-sm"><p className="font-bold">Last review: {item.review.decision === "approved" ? "Approved" : "Returned for changes"}</p><p className="whitespace-pre-wrap wrap-break-word">{item.review.note || "No additional comments."}</p><p className="mt-1 text-xs">{item.review.at.slice(0, 10)} (UTC)</p></div>}
        {item.status === "submitted" && <div className="mt-4 space-y-3">
            <label className="block text-sm font-bold" htmlFor={`review-${item.id}`}>Feedback (required when returning)</label>
            <textarea id={`review-${item.id}`} maxLength={500} value={note} onChange={e => setNote(e.target.value)} className={fieldStyle} rows={3} />
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex flex-wrap gap-2"><button type="button" className={primaryStyle} onClick={() => decide("approved")}>Approve</button><button type="button" className={secondaryStyle} onClick={() => decide("returned")}>Return for changes</button></div>
        </div>}
    </article>;
}
export default function AdminOverview() {
    const { state, ready } = useAppState();
    const [filter, setFilter] = useState<"submitted" | "approved" | "reviewed">("submitted");
    const counts = { pending: state.contributions.filter(c => c.status === "submitted").length, approved: state.contributions.filter(c => c.status === "approved").length, returned: state.contributions.filter(c => c.status === "draft" && c.review?.decision === "returned").length };
    const items = state.contributions.filter(c => filter === "reviewed" ? !!c.review : c.status === filter);
    return <section className={panelStyle}>
        <Link href="/settings" className="inline-block py-3 font-bold text-purple-800">← Back to Settings</Link>
        <h1 className="mt-2 text-3xl font-extrabold">Admin Studio</h1>
        <p className="mt-2 text-sm text-stone-600">Review vocabulary contributions saved on this device. Approved questions appear in Community Quizzes.</p>
        {!ready ? <p role="status" className="mt-4">Loading submissions…</p> : <>
            <div aria-live="polite" className="my-5 grid grid-cols-3 gap-2">{Object.entries(counts).map(([label, count]) => <div key={label} className="rounded-xl bg-orange-50 p-3 text-center"><p className="text-2xl font-bold">{count}</p><p className="text-xs capitalize">{label}</p></div>)}</div>
            <div className="mb-4 flex flex-wrap gap-2">{([['submitted', 'Pending'], ['approved', 'Approved'], ['reviewed', 'Last reviews']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-xl border px-4 py-3 font-bold ${filter === value ? 'bg-[#ffe183]' : 'bg-white'}`}>{label}</button>)}</div>
            <div className="space-y-4">{items.length ? items.map(item => <ReviewCard key={`${item.id}:${item.updatedAt}`} item={item} />) : <p role="status" className="rounded-xl bg-white p-5">No contributions in this view.</p>}</div>
        </>}
    </section>;
}
