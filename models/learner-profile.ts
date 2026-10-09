import type { ProfileData } from "../types/profile";
import { clampPercentage } from "../lib/util";

/** Owns a defensive snapshot so views cannot mutate repository data. */
export class LearnerProfile {
  private readonly data: ProfileData;
  constructor(data: ProfileData) {
    this.data = {
      ...data,
      levelProgress: clampPercentage(data.levelProgress),
      stats: data.stats.map((item) => ({ ...item })),
      progress: data.progress.map((item) => ({ ...item, pct: clampPercentage(item.pct) })),
    };
  }
  toView(): ProfileData {
    return { ...this.data, stats: this.data.stats.map((item) => ({ ...item })),
      progress: this.data.progress.map((item) => ({ ...item })) };
  }
}
