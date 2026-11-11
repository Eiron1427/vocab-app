import type { AppState } from "@/types/app-state";
import type { Review } from "@/types/admin";
export class AdminModel {
    static parseReview(value: unknown): Review | undefined {
        if (!value || typeof value !== "object") return;
        const r = value as Record<string, unknown>;
        if ((r.decision === "approved" || r.decision === "returned") && typeof r.note === "string" && r.note.length <= 500 && typeof r.at === "string" && Number.isFinite(Date.parse(r.at)))
            return { decision: r.decision, note: r.note, at: r.at };
    }
    static review(state: AppState, id: string, expected: string, decision: Review["decision"], note: string): AppState {
        const fail = (message: string): never => { const e = new Error(message); e.name = "ValidationError"; throw e; };
        const item = state.contributions.find(c => c.id === id);
        if (!item || item.status !== "submitted" || item.updatedAt !== expected) fail("This submission changed. Reload the review before continuing.");
        if (decision !== "approved" && decision !== "returned") fail("Choose a valid decision.");
        note = note.trim();
        if (note.length > 500 || (decision === "returned" && !note)) fail("Provide feedback using 1–500 characters when returning a question.");
        const now = new Date().toISOString();
        return { ...state, contributions: state.contributions.map(c => c.id === id ? { ...c, status: decision === "approved" ? "approved" : "draft", updatedAt: now, review: { decision, note, at: now } } : c) };
    }
}
