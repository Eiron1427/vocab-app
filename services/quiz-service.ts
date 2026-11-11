import { QuizModel } from "@/models/quiz";
import { QuizRepository } from "@/repositories/quiz-repository";
import type { LocalRepository } from "@/repositories/local-repository";
export class QuizService {
    constructor(private readonly repository: QuizRepository, private readonly appRepository: LocalRepository) { }
    answer(id: string, index: number, option: number) {
        this.repository.update((state) =>
            QuizModel.answer(state, this.appRepository.read(), id, index, option),
        );
    }
    restart(id: string) {
        this.repository.update((state) => {
            if (!QuizModel.unlocked(id, this.appRepository.read()))
                throw new Error("This quiz is not available yet.");
            return {
                ...state,
                sessions: { ...state.sessions, [id]: { answered: 0, score: 0 } },
            };
        });
    }
}
