import { QUIZZES } from "@/data/quiz";
import { lessonsForAgeGroup } from "@/data/lesson";
import type { AppState } from "@/types/app-state";
import type { AgeGroup } from "@/types/age-group";
import type { QuizState } from "@/types/quiz";
export class QuizModel {
    static empty(): QuizState {
        return { progress: {}, sessions: {}, results: {} };
    }
    static total(id: string) {
        return Object.hasOwn(QUIZZES, id) ? QUIZZES[id].length : 0;
    }
    static lessons(ageGroup?: AgeGroup) {
        return lessonsForAgeGroup(ageGroup).filter((lesson) => this.total(String(lesson.id)) > 0);
    }
    static unlocked(id: string, app: Pick<AppState, "profile" | "completedLevels">): boolean {
        const lesson = this.lessons(app.profile.ageGroup).find((item) => String(item.id) === id);
        return !!lesson && lesson.levels
            .filter((level) => level.words.length > 0)
            .every((level) => app.completedLevels.includes(`${id}:${level.id}`));
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
                const result = data.results?.[id];
                if (
                    result &&
                    Number.isInteger(result.total) &&
                    result.total === total &&
                    Number.isInteger(result.score) &&
                    result.score >= 0 &&
                    result.score <= total
                ) {
                    state.results[id] = { score: result.score, total };
                    state.progress[id] = total;
                }
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

                    if (!state.results[id] && session.answered === total) {
                        state.results[id] = { score: session.score, total };
                    }
                }
            }
        } catch {
            /* Missing or damaged state starts empty. */
        }
        return state;
    }
    static answer(
        state: QuizState,
        app: Pick<AppState, "profile" | "completedLevels">,
        id: string,
        index: number,
        option: number,
    ): QuizState {
        if (!this.unlocked(id, app))
            throw new Error("Complete the matching lesson in your age track first.");
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
        const score = session.score + Number(option === question.answer);
        const total = this.total(id);
        return {
            ...state,
            results:
                index + 1 === total
                    ? { ...state.results, [id]: { score, total } }
                    : state.results,
            progress: {
                ...state.progress,
                [id]: Math.max(state.progress[id] ?? 0, index + 1),
            },
            sessions: {
                ...state.sessions,
                [id]: {
                    answered: index + 1,
                    score,
                },
            },
        };
    }
}
