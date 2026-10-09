import { CATEGORIES, type QuestionInput } from "../types/app-state";

/** Validates structure only. Semantic correctness requires a future verification service. */
export class QuestionModel {
    constructor(private readonly input: QuestionInput) { }
    normalized(): QuestionInput {
        return {
            ...this.input,
            question: this.input.question.trim(),
            answer: this.input.answer.trim(),
        };
    }
    validate(): string | null {
        const item = this.normalized();
        if (!item.id) return "Start a new question first.";
        if (!CATEGORIES.includes(item.category)) return "Choose a category.";
        if (item.question.length < 10 || item.question.length > 500)
            return "Write a question using 10–500 characters.";
        if (!item.answer || item.answer.length > 100)
            return "Write an answer using 1–100 characters.";
        return null;
    }
    static fingerprint(input: QuestionInput): string {
        return [input.category, input.question, input.answer]
            .map((value) => value.trim().replace(/\s+/g, " ").toLowerCase())
            .join("|");
    }
}
