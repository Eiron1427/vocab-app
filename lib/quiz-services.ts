import { QuizRepository } from "@/repositories/quiz-repository";
import { QuizService } from "@/services/quiz-service";
export const quizRepository = new QuizRepository();
export const quizService = new QuizService(quizRepository);
