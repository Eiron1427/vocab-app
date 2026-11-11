import { LocalRepository } from "../repositories/local-repository";
import { AuthValidator } from "../validators/auth-validator";
import type { ProfileSettings } from "../types/app-state";
import { isAgeGroup } from "../types/age-group";
import { lessonsForAgeGroup } from "../data/lesson";
import { LessonService } from "./lesson-service";
export class SettingsService {
    constructor(
        private readonly repository: LocalRepository,
        private readonly validator = new AuthValidator(),
    ) { }
    setNotifications(enabled: boolean) {
        this.repository.update((state) => ({ ...state, notifications: enabled }));
    }
    setVolume(value: number) {
        if (!Number.isFinite(value)) throw new Error("Choose a valid volume.");
        this.repository.update((state) => ({
            ...state,
            volume: Math.round(Math.max(0, Math.min(100, value))),
        }));
    }
    saveProfile(input: ProfileSettings) {
        if (input.ageGroup !== undefined && !isAgeGroup(input.ageGroup))
            throw new Error("Choose a valid learner age group.");
        const username = input.username.trim();
        const email = input.email.trim();
        const usernameResult = this.validator.validateUsername(username);

        if (!usernameResult.valid) {
            throw new Error(usernameResult.error);
        }

        if (email) {
            const result = this.validator.validateEmail(email);
            if (!result.valid) throw new Error(result.error);
        }
        this.repository.update((state) => ({
            ...state,
            profile: { ...state.profile, username, email, ageGroup: input.ageGroup ?? state.profile.ageGroup },
        }));
    }
    completeLessonLevel(lessonId: number, levelId: number) {
        this.repository.update((state) => {
            const lessons = new LessonService(lessonsForAgeGroup(state.profile.ageGroup));
            if (!lessons.canOpenLevel(lessonId, levelId, state.completedLevels)) {
                const error = new Error("This level is unavailable for your current lesson track.");
                error.name = "ValidationError";
                throw error;
            }
            return { ...state, completedLevels: lessons.completeLevel(lessonId, levelId, state.completedLevels) };
        });
    }
    setAvatar(avatar: string) {
        if (
            avatar !== "" &&
            (avatar.length > 700_000 ||
                !/^data:image\/(png|jpeg|webp);base64,/.test(avatar))
        ) {
            throw new Error("Choose a JPG, PNG, or WebP image under 500 KB.");
        }

        this.repository.update((state) => ({
            ...state,
            avatar,
            shop: {
                ...state.shop,
                equipped: { ...state.shop.equipped, avatar: null },
            },
        }));
    }
}
