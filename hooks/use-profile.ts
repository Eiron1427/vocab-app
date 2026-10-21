"use client";
import { useMemo } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { useQuiz } from "@/hooks/use-quiz";
import { SnapshotProfileRepository } from "@/repositories/profile-repository";
import { ProfileService } from "@/services/profile-service";
export function useProfile() {
  const { state: app, ready: appReady } = useAppState();
  const { state: quiz, ready: quizReady } = useQuiz();
  const profile = useMemo(
    () =>
      new ProfileService(
        new SnapshotProfileRepository(app, quiz),
      ).getOverview(),
    [app, quiz],
  );
  return { profile, ready: appReady && quizReady };
}
