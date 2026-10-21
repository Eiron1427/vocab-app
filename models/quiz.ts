import { QUIZZES } from "@/data/quiz";
import type { QuizState } from "@/types/quiz";
export class QuizModel {
    static empty(): QuizState {
        return { progress: {}, sessions: {} };
    }
    static total(id: string) {
        return QUIZZES[id]?.length ?? 0;
    }
    static unlocked(id: string, state: QuizState): boolean {
        const ids = Object.keys(QUIZZES).sort((a, b) => Number(a) - Number(b));
        const index = ids.indexOf(id);
        return (
            index >= 0 &&
            ids
                .slice(0, index)
                .every((key) => (state.progress[key] ?? 0) >= this.total(key))
        );
    }
    static parse(raw: string | null): QuizState {
        const state = this.empty();
        if (!raw) return state;
        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== "object" || Array.isArray(data))
                return state;
            for (const id of Object.keys(QUIZZES)) {
                const total = this.total(id);
                const progress = data.progress?.[id];
                if (Number.isInteger(progress) && progress >= 0 && progress <= total)
                    state.progress[id] = progress;
                const session = data.sessions?.[id];
                if (
                    session &&
                    Number.isInteger(session.answered) &&
                    session.answered >= 0 &&
                    session.answered <= total &&
                    Number.isInteger(session.score) &&
                    session.score >= 0 &&
                    session.score <= session.answered
                ) {
                    state.sessions[id] = {
                        answered: session.answered,
                        score: session.score,
                    };
                    state.progress[id] = Math.max(
                        state.progress[id] ?? 0,
                        session.answered,
                    );
                }
            }
        } catch {
            /* Missing or damaged state starts empty. */
        }
        return state;
    }
    static answer(
        state: QuizState,
        id: string,
        index: number,
        option: number,
    ): QuizState {
        if (!this.unlocked(id, state))
            throw new Error("Complete the previous quiz first.");
        const session = state.sessions[id] ?? { answered: 0, score: 0 };
        if (session.answered !== index)
            throw new Error("This quiz changed in another tab. Reload to continue.");
        const question = QUIZZES[id]?.[index];
        if (
            !question ||
            !Number.isInteger(option) ||
            option < 0 ||
            option >= question.options.length
        )
            throw new Error("Choose a valid answer.");
        return {
            progress: {
                ...state.progress,
                [id]: Math.max(state.progress[id] ?? 0, index + 1),
            },
            sessions: {
                ...state.sessions,
                [id]: {
                    answered: index + 1,
                    score: session.score + Number(option === question.answer),
                },
            },
        };
    }
}
