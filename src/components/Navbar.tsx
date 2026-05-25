"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  Bell,
  Menu,
  X,
  Search,
  LayoutDashboard,
  LogIn,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/notifications/unread")
        .then((r) => r.json())
        .then((d) => setUnread(d.count ?? 0))
        .catch(() => {});
    }
  }, [session]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const links = [
    { href: "/colleges", label: "Colleges" },
    { href: "/compare", label: "Compare" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
          <GraduationCap className="h-8 w-8" />
          <span className="hidden sm:inline">CollegeDiscovery</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {session && (
            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
          )}
          {session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                {session.user.name ?? "Dashboard"}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:flex"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 px-4 py-4 md:hidden dark:border-gray-800">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            />
          </form>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 dark:text-gray-300"
            >
              {l.label}
            </Link>
          ))}
          {!session && (
            <Link href="/login" className="mt-2 block text-blue-600" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
