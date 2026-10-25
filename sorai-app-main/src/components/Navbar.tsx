"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, List, LogOut, ChevronDown, Menu, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateSearch } from "@/lib/validators";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
    return (
        <Suspense fallback={null}>
            <NavbarContent />
        </Suspense>
    );
}

function NavbarContent() {
    const { user, isLoading, signOut, setOpenModal, username, profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const browseType = searchParams.get("type");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateSearch(searchQuery);
        if (error) {
            toast.warning("Search too short", { description: error });
            return;
        }
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setShowMobileMenu(false);
    };

    const isActive = (path: string) => pathname === path;

    const isLoggedIn = !!user;

    return (
        <>
            <nav
                className="sticky top-0 z-50 transition-all duration-300"
                style={{
                    backgroundColor: scrolled ? "var(--color-glass-white-97)" : "var(--color-surface)",
                    boxShadow: scrolled
                        ? "var(--shadow-navbar-scrolled)"
                        : "var(--shadow-navbar)",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                }}
            >
                <div className="max-w-container mx-auto px-6 md:px-10 h-16 flex items-center">
                    {/* Left: Logo + Nav */}
                    <div className="flex items-center gap-4 flex-1">
                        <Link href="/" className="flex items-center shrink-0 group">
                            <span className="text-2xl shrink-0 font-logo tracking-wide text-primary">
                                Sorai
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/browse?type=popular"
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === "/browse" && browseType === "popular"
                                    ? "text-primary bg-primary-light font-medium"
                                    : "text-text-secondary hover:text-primary"
                                    }`}
                            >
                                Popular
                            </Link>
                            <Link
                                href="/browse?type=season"
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === "/browse" && browseType === "season"
                                    ? "text-primary bg-primary-light font-medium"
                                    : "text-text-secondary hover:text-primary"
                                    }`}
                            >
                                Seasonal
                            </Link>
                            <Link
                                href="/browse?type=upcoming"
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === "/browse" && browseType === "upcoming"
                                    ? "text-primary bg-primary-light font-medium"
                                    : "text-text-secondary hover:text-primary"
                                    }`}
                            >
                                Upcoming
                            </Link>
                            <Link
                                href="/browse?type=airing"
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === "/browse" && browseType === "airing"
                                    ? "text-primary bg-primary-light font-medium"
                                    : "text-text-secondary hover:text-primary"
                                    }`}
                            >
                                Top Airing
                            </Link>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <form onSubmit={handleSearch} className="hidden md:block flex-none w-[300px]">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search anime..."
                                maxLength={100}
                                className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-surface-hover text-sm text-text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                    </form>

                    {/* Right: Theme toggle + Auth */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                        {!isLoading && !isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={() => setOpenModal("login")}
                                    className="px-4 h-9 text-sm text-text-secondary hover:text-primary hover:bg-primary-light rounded-xl transition-colors"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => setOpenModal("register")}
                                    className="px-4 h-9 text-sm text-white rounded-xl transition-all hover:opacity-90 hover:shadow-md"
                                    style={{
                                        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                                    }}
                                >
                                    Sign up
                                </button>
                            </div>
                        ) : isLoggedIn ? (
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-alt transition-colors"
                                >
                                    {profile?.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm text-text-primary">{username}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-text-secondary transition-transform ${showUserMenu ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-52 bg-surface rounded-2xl shadow-xl border border-surface-alt overflow-hidden z-20">
                                            <div className="px-4 py-3 border-b border-surface-alt">
                                                <p className="text-xs text-gray-400">Signed in as</p>
                                                <p className="text-sm text-text-primary">@{username}</p>
                                            </div>
                                            <Link
                                                href="/my-list"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                                            >
                                                <List size={16} className="text-text-secondary" />
                                                My List
                                            </Link>
                                            <Link
                                                href="/settings"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                                            >
                                                <Settings size={16} className="text-text-secondary" />
                                                Settings
                                            </Link>
                                            <div className="border-t border-surface-alt">
                                                <button
                                                    onClick={() => {
                                                        signOut();
                                                        setShowUserMenu(false);
                                                        toast.success("Signed out");
                                                        router.push("/");
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-error hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : null}

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-alt"
                        >
                            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-surface-alt px-6 py-4 space-y-3 bg-surface">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search anime..."
                                    maxLength={100}
                                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-surface-hover text-sm text-text-primary placeholder-gray-400 focus:outline-none focus:border-primary"
                                />
                            </div>

                        </form>
                        <ThemeToggle />
                        <Link
                            href="/browse?type=popular"
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-2 text-sm text-gray-700"
                        >
                            Popular
                        </Link>
                        <Link
                            href="/browse?type=season"
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-2 text-sm text-gray-700"
                        >
                            Seasonal
                        </Link>
                        <Link
                            href="/browse?type=upcoming"
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-2 text-sm text-gray-700"
                        >
                            Upcoming
                        </Link>
                        <Link
                            href="/browse?type=airing"
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-2 text-sm text-gray-700"
                        >
                            Top Airing
                        </Link>
                        {!isLoggedIn ? (
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setOpenModal("login");
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex-1 h-10 text-sm border border-border text-gray-700 rounded-xl"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenModal("register");
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex-1 h-10 text-sm text-white rounded-xl"
                                    style={{
                                        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                                    }}
                                >
                                    Sign up
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/my-list"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="w-full h-10 text-sm border border-border text-gray-700 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <List size={16} />
                                    My List
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="w-full h-10 text-sm border border-border text-gray-700 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        toast.success("Signed out");
                                        router.push("/");
                                        setShowMobileMenu(false);
                                    }}
                                    className="w-full h-10 text-sm text-error border border-red-200 rounded-xl"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}
