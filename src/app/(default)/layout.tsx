import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div className="h-14 border-b border-zinc-200 bg-white" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
    </>
  );
}
