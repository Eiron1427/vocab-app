"use client";
import { useRef, useState } from "react";
import { Check, Coins, ShoppingBag } from "lucide-react";
import { useShop } from "@/hooks/use-shop";
import { shopService } from "@/lib/app-services";
import type { ShopCategory } from "@/types/shop";
import ShopItemPreview from "./shop-item-preview";
const categories: { key: ShopCategory; label: string }[] = [
    { key: "avatar", label: "Avatar" },
    { key: "background", label: "Background" },
    { key: "border", label: "Border" },
];
const buttonStyle =
    "flex min-h-11 w-full items-center justify-center gap-1 rounded-xl border-2 border-stone-800 bg-[#ffe183] px-2 py-2 text-sm font-bold text-stone-900 hover:bg-[#ffd45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 disabled:cursor-not-allowed disabled:opacity-60";
export default function ShopOverview() {
    const { shop, ready } = useShop();
    const [category, setCategory] = useState<ShopCategory>("avatar");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const busy = useRef(false);
    function act(action: () => void, message: string) {
        if (busy.current) return;
        busy.current = true;
        setError("");
        setNotice("");
        try {
            action();
            setNotice(message);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not save your changes.",
            );
        } finally {
            busy.current = false;
        }
    }
    return (
        <section
            aria-labelledby="shop-heading"
            className="rounded-[26px] bg-white/90 p-4 shadow-sm sm:p-6"
        >
            <div className="flex items-center justify-center gap-2">
                <ShoppingBag aria-hidden="true" className="text-purple-700" />
                <h1
                    id="shop-heading"
                    className="text-center text-2xl font-extrabold sm:text-3xl"
                >
                    Welcome to the Shop
                </h1>
            </div>
            <p className="mt-2 text-center text-sm text-stone-600">
                Choose a look for your learning adventure.
            </p>
            {!ready ? (
                <p role="status" className="mt-6">
                    Loading your shop…
                </p>
            ) : (
                <>
                    <p className="my-5 flex items-center justify-between rounded-2xl bg-[#fff0bc] p-4 font-bold">
                        <span className="flex items-center gap-2">
                            <Coins aria-hidden="true" size={20} />
                            Points available
                        </span>
                        <span>{shop.points}</span>
                    </p>
                    <div
                        aria-label="Shop categories"
                        className="mb-5 grid grid-cols-3 gap-2"
                    >
                        {categories.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={category === key}
                                onClick={() => {
                                    setCategory(key);
                                    setError("");
                                    setNotice("");
                                }}
                                className={`min-h-11 rounded-full border-2 border-stone-800 px-1 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 sm:text-sm ${category === key ? "bg-[#ffb703]" : "bg-[#ffe183] hover:bg-[#ffd45a]"}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {error && (
                        <p
                            role="alert"
                            className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800"
                        >
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p
                            role="status"
                            className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800"
                        >
                            {notice}
                        </p>
                    )}
                    <ul className="grid grid-cols-2 gap-3">
                        {shopService.list(category).map((item) => {
                            const owned = shop.ownedIds.includes(item.id);
                            const equipped = shop.equipped[item.category] === item.id;
                            const affordable = shop.points >= item.price;
                            return (
                                <li
                                    key={item.id}
                                    className="flex min-w-0 flex-col gap-3 rounded-2xl border-2 border-stone-800 bg-[#ffddb0] p-3"
                                >
                                    <ShopItemPreview item={item} />
                                    <h2 className="text-center font-bold">{item.name}</h2>
                                    <p className="text-center text-xs text-stone-700">
                                        {owned
                                            ? equipped
                                                ? "Equipped"
                                                : "Owned"
                                            : `${item.price} points`}
                                    </p>
                                    {!owned ? (
                                        <button
                                            type="button"
                                            disabled={!affordable}
                                            aria-label={`Buy ${item.name} for ${item.price} points`}
                                            onClick={() =>
                                                act(
                                                    () => shopService.buy(item.id),
                                                    `${item.name} purchased. Choose Equip to use it.`,
                                                )
                                            }
                                            className={`${buttonStyle} mt-auto`}
                                        >
                                            {affordable ? "Buy" : "Not enough points"}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label={`${equipped ? "Unequip" : "Equip"} ${item.name}`}
                                            onClick={() =>
                                                act(
                                                    () =>
                                                        equipped
                                                            ? shopService.unequip(category)
                                                            : shopService.equip(item.id),
                                                    `${item.name} ${equipped ? "unequipped" : "equipped"}.`,
                                                )
                                            }
                                            className={`${buttonStyle} mt-auto`}
                                        >
                                            {equipped && <Check size={16} aria-hidden="true" />}
                                            {equipped ? "Unequip" : "Equip"}
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-5 text-xs leading-relaxed text-stone-600">
                        Purchases and points are saved on this device. Your starting
                        allowance is 500 points; earning more through activities will be
                        added later.
                    </p>
                </>
            )}
        </section>
    );
}
