import type { ReactNode } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="flex min-h-svh items-center justify-center bg-[#85d8f5] bg-[url('/images/park-background.png')] bg-cover bg-center bg-no-repeat px-4 py-7 text-[#111]">
<<<<<<< HEAD
            <div className="w-full max-w-130">
=======
            <div className="w-full max-w-[520px]">
>>>>>>> 2e5d4f00a20ce2d02a367e5345e7c9cac7566892
                {children}
            </div>
        </main>
    );
}