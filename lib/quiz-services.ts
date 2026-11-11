import { QuizRepository } from "@/repositories/quiz-repository";
import { QuizService } from "@/services/quiz-service";
import { localRepository } from "@/lib/app-services";
export const quizRepository = new QuizRepository();
export const quizService = new QuizService(quizRepository, localRepository);
