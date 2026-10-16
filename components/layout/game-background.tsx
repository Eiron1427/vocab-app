"use client";
import { useShop } from "@/hooks/use-shop";
export default function GameBackground() {
    const { background } = useShop();
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 bg-[#85d8f5] bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: background?.image
                    ? `url("${background.image}")`
                    : "url('/images/park-background.png')",
            }}
        />
    );
}
