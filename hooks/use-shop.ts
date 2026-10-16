"use client";
import { useAppState } from "./use-app-state";
import { ShopModel } from "@/models/shop";
export function useShop() {
    const { state, ready } = useAppState();
    const shop = state.shop;
    return {
        shop,
        ready,
        avatar: ShopModel.item(shop.equipped.avatar ?? ""),
        background: ShopModel.item(shop.equipped.background ?? ""),
        border: ShopModel.item(shop.equipped.border ?? ""),
    };
}
