export class SpeechService {
    speak(
        text: string,
        volume: number,
        onError?: (message: string) => void,
    ): void {
        if (typeof window === "undefined" || !("speechSynthesis" in window))
            throw new Error("Pronunciation is not available in this browser.");
        if (volume <= 0)
            throw new Error(
                "Sound is muted. Increase pronunciation volume in Settings.",
            );
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.volume = Math.max(0, Math.min(1, volume / 100));
        utterance.onerror = (event) => {
            if (event.error !== "canceled" && event.error !== "interrupted")
                onError?.(
                    "Could not play pronunciation. Check your device's voice and sound settings.",
                );
        };
        window.speechSynthesis.speak(utterance);
    }
    stop(): void {
        if (typeof window !== "undefined" && "speechSynthesis" in window)
            window.speechSynthesis.cancel();
    }
}
