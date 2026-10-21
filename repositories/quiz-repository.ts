import { QuizModel } from "@/models/quiz";
import type { QuizState } from "@/types/quiz";
export class QuizRepository {
    static readonly key = "vocab-app.quiz.v1";
    static readonly event = "vocab-app:quiz-change";
    snapshot(): string | null {
        try {
            return window.localStorage.getItem(QuizRepository.key);
        } catch {
            return null;
        }
    }
    read(): QuizState {
        return QuizModel.parse(this.snapshot());
    }
    update(change: (state: QuizState) => QuizState): void {
        let raw: string | null;
        try {
            raw = window.localStorage.getItem(QuizRepository.key);
        } catch {
            throw new Error(
                "Browser storage is unavailable. Allow storage to save quiz progress.",
            );
        }
        const next = change(QuizModel.parse(raw));
        try {
            window.localStorage.setItem(QuizRepository.key, JSON.stringify(next));
        } catch {
            throw new Error(
                "Could not save your answer. Free some browser storage and try again.",
            );
        }
        window.dispatchEvent(new Event(QuizRepository.event));
    }
}
