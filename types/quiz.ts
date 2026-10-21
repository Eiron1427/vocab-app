export interface QuizQuestion {
    prompt: string;
    options: readonly string[];
    answer: number;
}
export interface QuizSession {
    answered: number;
    score: number;
}
/** Latest finished score survives restarting the current attempt. */
export interface QuizResult {
    score: number;
    total: number;
}
export interface QuizState {
    progress: Record<string, number>;
    sessions: Record<string, QuizSession>;
    results: Record<string, QuizResult>;
}
