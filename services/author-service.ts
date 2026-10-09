import { QuestionModel } from "../models/question";
import { LocalRepository } from "../repositories/local-repository";
import type { Contribution, QuestionInput } from "../types/app-state";
export class AuthorService {
    constructor(private readonly repository: LocalRepository) { }
    save(input: QuestionInput, status: Contribution["status"]): void {
        const model = new QuestionModel(input);
        const error = model.validate();
        if (error) throw new Error(error);
        const item = model.normalized();
        this.repository.update((state) => {
            const existing = state.contributions.find(
                (entry) => entry.id === item.id,
            );
            if (existing?.status === "submitted") return state; // Double submit cannot create duplicates.
            const duplicate = state.contributions.some(
                (entry) =>
                    entry.id !== item.id &&
                    entry.status === "submitted" &&
                    QuestionModel.fingerprint(entry) === QuestionModel.fingerprint(item),
            );
            if (duplicate) {
                const error = new Error(
                    "You already submitted this question.",
                );
                error.name = "ValidationError";
                throw error;
            }
            if (!existing && state.contributions.length >= 100) {
                const error = new Error("You can save up to 100 contributions on this device.");
                error.name = "ValidationError";
                throw error;
            }
            const now = new Date().toISOString();
            const saved: Contribution = {
                ...item,
                status,
                createdAt: existing?.createdAt ?? now,
                updatedAt: now,
            };
            return {
                ...state,
                contributions: [
                    saved,
                    ...state.contributions.filter((entry) => entry.id !== item.id),
                ],
            };
        });
    }
}
