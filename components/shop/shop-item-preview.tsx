import Image from "next/image";
import type { ShopItem } from "@/types/shop";
export default function ShopItemPreview({ item }: { item: ShopItem }) {
    return (
        <div
            aria-hidden="true"
            className="flex h-28 items-center justify-center rounded-xl bg-white/70"
        >
            {item.category === "border" && item.image ? (
                <div className="relative flex size-24 items-center justify-center">
                    <Image
                        src="/avatar/fox.png"
                        alt=""
                        width={64}
                        height={64}
                        className="size-16 rounded-full object-cover"
                    />
                    <Image
                        src={item.image}
                        alt=""
                        width={96}
                        height={96}
                        unoptimized
                        className="pointer-events-none absolute inset-0 size-24 object-contain"
                    />
                </div>
            ) : item.image ? (
                <Image
                    src={item.image}
                    alt=""
                    width={item.category === "background" ? 320 : 96}
                    height={item.category === "background" ? 180 : 96}
                    className={
                        item.category === "background"
                            ? "h-24 w-full rounded-lg object-cover"
                            : "size-24 rounded-full object-cover"
                    }
                />
            ) : (
                <span className="text-6xl">{item.visual}</span>
            )}
        </div>
    );
}
