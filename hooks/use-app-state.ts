"use client";
import { useMemo, useSyncExternalStore } from "react";
import { AppStateModel } from "@/models/app-state";
import { LocalRepository } from "@/repositories/local-repository";
import { localRepository } from "@/lib/app-services";
const snapshot = () => localRepository.snapshot();
const serverSnapshot = () => null;
const noopSubscribe = () => () => { };
const clientReady = () => true;
const serverReady = () => false;
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LocalRepository.event, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LocalRepository.event, callback);
  };
}
export function useAppState() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, clientReady, serverReady);
  const state = useMemo(() => AppStateModel.parse(raw), [raw]);
  return { state, ready };
}
