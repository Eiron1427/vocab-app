"use client";

import { useMemo } from "react";
import { PasswordStrengthService } from
    "@/services/password-strength-service";

const strengthService = new PasswordStrengthService();

const RATINGS = [
    { label: "Very weak", color: "bg-red-600" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-lime-600" },
    { label: "Very strong", color: "bg-green-700" },
] as const;

interface PasswordStrengthProps {
    password: string;
    id: string;
}

export default function PasswordStrength({
    password,
    id,
}: PasswordStrengthProps) {
    const result = useMemo(
        () => password ? strengthService.evaluate(password) : null,
        [password],
    );

    const score = result?.score ?? 0;
    const rating = RATINGS[score];
    const filledBars = result ? score + 1 : 0;

    return (
        <div
            id={id}
            className="mt-3 rounded-xl bg-white/60 p-3 text-sm"
        >
            <p
                aria-live="polite"
                aria-atomic="true"
                className="font-semibold text-stone-800"
            >
                {result
                    ? `Estimated strength: ${rating.label}`
                    : "Enter a password to check its strength."}
            </p>

            <div
                aria-hidden="true"
                className="mt-2 flex gap-1"
            >
                {RATINGS.map((item, index) => (
                    <span
                        key={item.label}
                        className={`h-2 flex-1 rounded-full ${index < filledBars
                                ? rating.color
                                : "bg-stone-300"
                            }`}
                    />
                ))}
            </div>

            <p className="mt-2 text-stone-700">
                {password.length >= 8
                    ? "✓ Meets the demo’s 8-character minimum."
                    : "Use at least 8 characters."}
            </p>

            {result?.warning && (
                <p className="mt-2 text-amber-900">
                    {result.warning}
                </p>
            )}

            {result && result.suggestions.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-700">
                    {result.suggestions.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-stone-700">
                    Try a long phrase with unrelated words.
                    Avoid names, birthdays, and passwords you
                    use elsewhere.
                </p>
            )}
        </div>
    );
}