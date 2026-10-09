"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { RefreshCcw, User } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { settingsService } from "@/lib/app-services";

export default function ProfileAvatar() {
    const { state, ready } = useAppState();
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    async function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setError("");
        setNotice("");

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Choose a JPG, PNG, or WebP image.");
            return;
        }

        if (file.size > 500 * 1024) {
            setError("Choose an image smaller than 500 KB.");
            return;
        }

        setBusy(true);

        try {
            const image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => {
                    if (typeof reader.result === "string") {
                        resolve(reader.result);
                    } else {
                        reject(new Error("Could not read this image."));
                    }
                };

                reader.onerror = () => reject(
                    new Error("Could not read this image.")
                );

                reader.readAsDataURL(file);
            });

            // Check that the selected file actually contains a readable image.
            await new Promise<void>((resolve, reject) => {
                const preview = new window.Image();
                preview.onload = () => resolve();
                preview.onerror = () => reject(
                    new Error("This image could not be opened. Choose another.")
                );
                preview.src = image;
            });

            settingsService.setAvatar(image);
            setNotice("Avatar updated.");
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not save the avatar."
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="relative shrink-0">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={changeAvatar}
                className="hidden"
                aria-label="Choose an avatar image"
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={!ready || busy}
                aria-label={busy ? "Saving avatar" : "Change avatar"}
                title="Change avatar"
                className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700 disabled:opacity-50"
            >
                {state.avatar ? (
                    <Image
                        src={state.avatar}
                        alt="Your avatar"
                        width={64}
                        height={64}
                        unoptimized
                        className="h-full w-full rounded-full object-cover"
                    />
                ) : (
                    <User
                        className="h-10 w-10 fill-black"
                        strokeWidth={0}
                        aria-hidden="true"
                    />
                )}

                <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 text-black">
                    <RefreshCcw size={14} aria-hidden="true" />
                </span>
            </button>

            {error && (
                <p
                    role="alert"
                    className="absolute left-0 top-full z-10 mt-2 w-56 rounded-xl border border-red-200 bg-white p-3 text-xs text-red-700 shadow-md"
                >
                    {error}
                </p>
            )}

            <span role="status" className="sr-only">
                {busy ? "Saving avatar…" : notice}
            </span>
        </div>
    );
}

