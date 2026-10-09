import { AppStateModel } from "../models/app-state";
import type { AppState } from "../types/app-state";
export interface KeyValueStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export class LocalRepository {
    static readonly key = "vocab-app.local.v1";
    private static readonly legacyKey = "vocab-app.demo.v1";
    static readonly event = "vocab-app:local-change";
    constructor(
        private readonly storage: () => KeyValueStorage = () => window.localStorage,
    ) { }
    // Stable primitive snapshot for useSyncExternalStore; never return a new object here.
    snapshot(): string | null {
        try {
            const storage = this.storage();
            return (
                storage.getItem(LocalRepository.key) ??
                storage.getItem(LocalRepository.legacyKey)
            );
        } catch {
            return null;
        }
    }
    read(): AppState {
        return AppStateModel.parse(this.snapshot());
    }
    update(change: (state: AppState) => AppState): void {
        try {
            const storage = this.storage();
            const current = AppStateModel.parse(
                storage.getItem(LocalRepository.key) ??
                storage.getItem(LocalRepository.legacyKey),
            );
            storage.setItem(LocalRepository.key, JSON.stringify(change(current)));
        } catch (error) {
            if (error instanceof Error && error.name === "ValidationError")
                throw error;
            throw new Error(
                "Could not save on this device. Allow browser storage or free some space, then try again.",
            );
        }
        if (typeof window !== "undefined")
            window.dispatchEvent(new Event(LocalRepository.event));
    }
}
