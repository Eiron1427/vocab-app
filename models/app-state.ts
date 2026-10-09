import {
    CATEGORIES,
    type Contribution,
    type AppState,
} from "../types/app-state";
const object = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

/** Treat browser storage as untrusted input and recover useful valid fields. */
export class AppStateModel {
    static empty(): AppState {
        return {
            version: 1,
            avatar: "",
            notifications: true,
            volume: 85,
            profile: { username: "Learner", email: "" },
            completedLevels: [],
            contributions: [],
        };
    }
    static parse(raw: string | null): AppState {
        const state = this.empty();
        if (!raw) return state;
        let data: unknown;
        try {
            data = JSON.parse(raw);
        } catch {
            return state;
        }
        if (!object(data) || data.version !== 1) return state;
        if (
            typeof data.avatar === "string" &&
            data.avatar.length <= 700_000 &&
            /^data:image\/(png|jpeg|webp);base64,/.test(data.avatar)
        ) {
            state.avatar = data.avatar;
        }
        if (typeof data.notifications === "boolean")
            state.notifications = data.notifications;
        if (typeof data.volume === "number" && Number.isFinite(data.volume))
            state.volume = Math.round(Math.max(0, Math.min(100, data.volume)));
        if (object(data.profile)) {
            if (
                typeof data.profile.username === "string" &&
                data.profile.username.trim()
            )
                state.profile.username = data.profile.username.trim().slice(0, 30);
            if (typeof data.profile.email === "string")
                state.profile.email = data.profile.email.slice(0, 254);
        }
        if (Array.isArray(data.completedLevels))
            state.completedLevels = [
                ...new Set(
                    data.completedLevels.filter(
                        (key): key is string =>
                            typeof key === "string" && /^\d+:\d+$/.test(key),
                    ),
                ),
            ].slice(0, 1000);
        if (Array.isArray(data.contributions)) {
            state.contributions = data.contributions
                .filter((item): item is Contribution => {
                    if (!object(item)) return false;
                    return (
                        typeof item.id === "string" &&
                        typeof item.question === "string" &&
                        item.question.length <= 500 &&
                        typeof item.answer === "string" &&
                        item.answer.length <= 100 &&
                        CATEGORIES.some((category) => category === item.category) &&
                        (item.status === "draft" || item.status === "submitted") &&
                        typeof item.createdAt === "string" &&
                        Number.isFinite(Date.parse(item.createdAt)) &&
                        typeof item.updatedAt === "string" &&
                        Number.isFinite(Date.parse(item.updatedAt))
                    );
                })
                .slice(0, 100)
                .map((item) => ({
                    id: item.id,
                    category: item.category,
                    question: item.question,
                    answer: item.answer,
                    status: item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }));
        }
        return state;
    }
}
