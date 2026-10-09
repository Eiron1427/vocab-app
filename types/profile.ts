export type ProfileMetric = "lessons" | "quizzes" | "score" | "level" | "streak";
export interface ProfileStat { metric: ProfileMetric; value: string; label: string }
export interface ProfileProgress { metric: ProfileMetric; label: string; pct: number; right: string }
export interface ProfileData {
    displayName: string;
    levelProgress: number;
    stats: readonly ProfileStat[];
    progress: readonly ProfileProgress[];
}
