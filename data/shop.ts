import type { ShopItem } from "../types/shop";
export const STARTING_POINTS = 500;
// Supplied Shop 2.0 artwork. Robot retains a placeholder until its image is provided.
export const SHOP_ITEMS: readonly ShopItem[] = [
    {
        id: "av-1",
        image: "/avatar/fox.png",
        name: "Fox",
        price: 100,
        category: "avatar",
        visual: "🦊",
    },
    {
        id: "av-2",
        image: "/avatar/panda.png",
        name: "Panda",
        price: 150,
        category: "avatar",
        visual: "🐼",
    },
    { id: "av-3", name: "Robot", price: 200, category: "avatar", visual: "🤖" },
    {
        id: "av-4",
        image: "/avatar/owl.png",
        name: "Owl",
        price: 250,
        category: "avatar",
        visual: "🦉",
    },
    {
        id: "bg-1",
        image: "/background/park.jpg",
        name: "Park",
        price: 120,
        category: "background",
        visual:
            "radial-gradient(ellipse at 15% 90%, #75b86b 0 25%, transparent 26%), radial-gradient(ellipse at 85% 100%, #368d68 0 35%, transparent 36%), linear-gradient(#95def6 0 65%, #cdeeb4 65%)",
    },
    {
        id: "bg-2",
        image: "/background/beach.jpg",
        name: "Beach",
        price: 180,
        category: "background",
        visual:
            "radial-gradient(circle at 80% 15%, #fff2a8 0 8%, transparent 9%), linear-gradient(#9be2f5 0 45%, #30b8c6 45% 65%, #fae4b3 65%)",
    },
    {
        id: "bg-3",
        image: "/background/space.jpg",
        name: "Space",
        price: 300,
        category: "background",
        visual:
            "radial-gradient(circle at 20% 25%, white 0 1px, transparent 2px), radial-gradient(circle at 75% 15%, #fce3a4 0 2px, transparent 3px), radial-gradient(ellipse at 80% 80%, #8656ab, transparent 45%), linear-gradient(140deg, #111b45, #493378)",
    },
    {
        id: "bd-1",
        image: "/border/gold.svg",
        name: "Gold",
        price: 150,
        category: "border",
        visual: "linear-gradient(135deg, #b87512, #fff1a6, #b87512)",
    },
    {
        id: "bd-2",
        image: "/border/rainbow.svg",
        name: "Rainbow",
        price: 220,
        category: "border",
        visual:
            "conic-gradient(#f87171, #facc15, #4ade80, #60a5fa, #c084fc, #f87171)",
    },
    {
        id: "bd-3",
        image: "/border/flame.svg",
        name: "Flame",
        price: 350,
        category: "border",
        visual: "conic-gradient(#dc2626, #fb923c, #fef08a, #f97316, #dc2626)",
    },
];
