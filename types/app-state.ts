import type { ShopState } from "./shop";
import type { AgeGroup } from "./age-group";
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
    ageGroup?: AgeGroup;
}
export interface QuestionInput {
    id: string;
    category: Category;
    question: string;
    answer: string;
}
export interface Contribution extends QuestionInput {
    review?: import("./admin").Review;
    status: "draft" | "submitted" | "approved";
    createdAt: string;
    updatedAt: string;
}
export interface AppState {
    shop: ShopState;
    version: 1;
    avatar: string;
    notifications: boolean;
    volume: number;
    profile: ProfileSettings;
    completedLevels: string[];
    contributions: Contribution[];
}
