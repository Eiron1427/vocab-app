import { LearnerProfile } from "@/models/learner-profile";
import type { AppState } from "@/types/app-state";
import type { QuizState } from "@/types/quiz";
export interface ProfileRepository {
  getProfile(): LearnerProfile;
}
/** Read-only adapter over the current snapshots from both storage hooks.
 * Profile totals are derived, never stored as a second copy. */
export class SnapshotProfileRepository implements ProfileRepository {
  constructor(
    private readonly app: AppState,
    private readonly quiz: QuizState,
  ) {}
  getProfile(): LearnerProfile {
    return LearnerProfile.fromState(this.app, this.quiz);
  }
}
