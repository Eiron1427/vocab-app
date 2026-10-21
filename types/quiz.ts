export interface QuizQuestion {
    prompt: string;
    options: readonly string[];
    answer: number;
}
export interface QuizSession {
    answered: number;
    score: number;
}
export interface QuizState {
    progress: Record<string, number>;
    sessions: Record<string, QuizSession>;
}
