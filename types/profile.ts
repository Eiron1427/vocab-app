export type ProfileMetric =
    "lessons" | "levels" | "quizzes" | "score" | "words";
export interface ProfileStat {
    metric: ProfileMetric;
    value: string;
    label: string;
}
export interface ProfileProgress {
    metric: ProfileMetric;
    label: string;
    pct: number;
    right: string;
}
export interface ProfileSummaryItem {
    id: string;
    kind: "lesson" | "quiz";
    title: string;
    detail: string;
    href: string;
}
export interface ProfileData {
    displayName: string;
    levelProgress: number;
    stats: readonly ProfileStat[];
    progress: readonly ProfileProgress[];
    summary: readonly ProfileSummaryItem[];
    scoredQuizzes: number;
    completedQuizzes: number;
}
