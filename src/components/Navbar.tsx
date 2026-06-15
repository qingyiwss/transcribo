import Link from "next/link";
import { Mic, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-zinc-900 hover:text-zinc-700 transition-colors"
        >
          <Mic className="h-6 w-6" />
          <span className="text-lg font-bold">Transcribo</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-sm text-zinc-400">
                {user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
