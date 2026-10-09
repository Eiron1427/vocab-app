import type { ReactNode } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="flex min-h-svh items-center justify-center bg-[#85d8f5] bg-[url('/images/park-background.png')] bg-cover bg-center bg-no-repeat px-4 py-7 text-[#111]">
            <div className="w-full max-w-130">
                {children}
            </div>
        </main>
    );
}