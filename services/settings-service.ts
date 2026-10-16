import { LocalRepository } from "../repositories/local-repository";
import { AuthValidator } from "../validators/auth-validator";
import type { ProfileSettings } from "../types/app-state";
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
            profile: { username, email },
        }));
    }
    setCompletedLevels(levels: string[]) {
        this.repository.update((state) => ({
            ...state,
            completedLevels: [...new Set(levels)],
        }));
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
