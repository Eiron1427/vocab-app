import type { ReactNode } from "react";
import BottomNav from "@/components/layout/bottom-nav";
import GameHeader from "@/components/layout/game-header";

export default function GameLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative isolate min-h-svh text-[#111]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[#85d8f5] bg-[url('/images/park-background.png')] bg-cover bg-center bg-no-repeat"
      />

      <div className="mx-auto flex min-h-svh w-full max-w-130 flex-col gap-4 px-4 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <GameHeader />

        <main className="min-w-0 flex-1">
          {children}
        </main>

        <div className="sticky bottom-0 z-20 pt-2 pb-[env(safe-area-inset-bottom)]">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}