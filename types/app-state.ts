export const CATEGORIES = [
    "Food",
    "Animals",
    "Emotions",
    "School",
    "Everyday words",
] as const;
export type Category = (typeof CATEGORIES)[number];
export interface ProfileSettings {
    username: string;
    email: string;
}
export interface QuestionInput {
    id: string;
    category: Category;
    question: string;
    answer: string;
}
export interface Contribution extends QuestionInput {
    status: "draft" | "submitted";
    createdAt: string;
    updatedAt: string;
}
export interface AppState {
    version: 1;
    avatar: string;
    notifications: boolean;
    volume: number;
    profile: ProfileSettings;
    completedLevels: string[];
    contributions: Contribution[];
}
