import { QuizModel } from "@/models/quiz";
import { QuizRepository } from "@/repositories/quiz-repository";
export class QuizService {
    constructor(private readonly repository: QuizRepository) { }
    answer(id: string, index: number, option: number) {
        this.repository.update((state) =>
            QuizModel.answer(state, id, index, option),
        );
    }
    restart(id: string) {
        this.repository.update((state) => {
            if (!QuizModel.unlocked(id, state))
                throw new Error("This quiz is not available yet.");
            return {
                ...state,
                sessions: { ...state.sessions, [id]: { answered: 0, score: 0 } },
            };
        });
    }
}
