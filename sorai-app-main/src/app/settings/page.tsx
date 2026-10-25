"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfilePhotoSection from "@/components/settings/ProfilePhotoSection";
import AccountSection from "@/components/settings/AccountSection";
import PasswordSection from "@/components/settings/PasswordSection";
import PreferencesSection from "@/components/settings/PreferencesSection";
import DangerZoneSection from "@/components/settings/DangerZoneSection";

export default function SettingsPage() {
    const router = useRouter();
    const { user, username, isLoading: authLoading, profile, refreshProfile, supabase, applyProfileUpdate } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [authLoading, user, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background">
                <main className="max-w-2xl mx-auto px-6 py-10">
                    <div className="h-8 skeleton w-48 mb-8" />
                    <div className="space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-40 skeleton rounded-2xl" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    const avatarUrl = profile?.avatar_url || null;
    const initial = (username?.[0] || "U").toUpperCase();

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-2xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-surface-alt transition-colors"
                    >
                        <ArrowLeft size={18} className="text-text-secondary" />
                    </button>
                    <h1
                        className="text-3xl text-text-primary"
                        style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
                    >
                        Settings
                    </h1>
                </div>

                <div className="space-y-6">
                    <ProfilePhotoSection
                        supabase={supabase}
                        userId={user.id}
                        avatarUrl={avatarUrl}
                        initial={initial}
                        refreshProfile={refreshProfile}
                    />

                    <AccountSection
                        supabase={supabase}
                        user={user}
                        username={username}
                    />

                    <PasswordSection supabase={supabase} />

                    <PreferencesSection
                        supabase={supabase}
                        userId={user.id}
                        showSensitiveContent={profile?.show_sensitive_content ?? false}
                        refreshProfile={refreshProfile}
                        applyProfileUpdate={applyProfileUpdate}
                    />

                    <DangerZoneSection
                        supabase={supabase}
                        userId={user.id}
                    />
                </div>
            </main>
        </div>
    );
}
