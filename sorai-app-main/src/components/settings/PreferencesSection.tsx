"use client";

import { useState, useEffect } from "react";
import { Shield, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { updateUserProfile } from "@/lib/user-profile";
import type { SupabaseClient } from "@supabase/supabase-js";

interface PreferencesSectionProps {
    supabase: SupabaseClient;
    userId: string;
    showSensitiveContent: boolean;
    refreshProfile: () => Promise<void>;
    applyProfileUpdate: (updates: {
        show_sensitive_content?: boolean;
        theme_preference?: "light" | "dark" | null;
    }) => void;
}

export default function PreferencesSection({
    supabase,
    userId,
    showSensitiveContent,
    refreshProfile,
    applyProfileUpdate,
}: PreferencesSectionProps) {
    const [sensitive, setSensitive] = useState(showSensitiveContent);
    const [saving, setSaving] = useState(false);
    const [savingTheme, setSavingTheme] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setSensitive(showSensitiveContent);
    }, [showSensitiveContent]);

    const handleToggle = async () => {
        const newValue = !sensitive;
        setSensitive(newValue);
        applyProfileUpdate({ show_sensitive_content: newValue });
        setSaving(true);
        try {
            await updateUserProfile(supabase, userId, {
                show_sensitive_content: newValue,
            });
            await refreshProfile();
            toast.success(newValue ? "Sensitive content enabled" : "Sensitive content disabled");
        } catch {
            setSensitive(!newValue);
            applyProfileUpdate({ show_sensitive_content: !newValue });
            toast.error("Failed to update preference");
        }
        setSaving(false);
    };

    const handleThemeToggle = async () => {
        const newTheme = isDark ? "light" : "dark";
        setTheme(newTheme);
        applyProfileUpdate({ theme_preference: newTheme });
        setSavingTheme(true);

        try {
            await updateUserProfile(supabase, userId, {
                theme_preference: newTheme,
            });
            await refreshProfile();
            toast.success(newTheme === "dark" ? "Dark mode enabled" : "Light mode enabled");
        } catch {
            toast.error("Theme changed locally, but could not be saved to your account");
        }

        setSavingTheme(false);
    };

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <section className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Preferences
            </h2>

            {/* Sensitive Content */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-text-primary font-medium">
                        Sensitive Content
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                        Show anime with mature or explicit content
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={saving}
                    className="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50"
                    style={{
                        backgroundColor: sensitive
                            ? "var(--color-primary)"
                            : "var(--color-text-disabled)",
                    }}
                >
                    <span
                        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
                        style={{
                            transform: sensitive ? "translateX(20px)" : "translateX(0)",
                        }}
                    />
                </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-text-primary font-medium flex items-center gap-2">
                        <Moon size={14} className="text-text-secondary" />
                        Dark Mode
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                        Switch between light and dark appearance
                    </p>
                </div>
                <button
                    onClick={handleThemeToggle}
                    disabled={savingTheme}
                    className="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none"
                    style={{
                        backgroundColor: isDark
                            ? "var(--color-primary)"
                            : "var(--color-text-disabled)",
                    }}
                >
                    <span
                        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
                        style={{
                            transform: isDark ? "translateX(20px)" : "translateX(0)",
                        }}
                    />
                </button>
            </div>
        </section>
    );
}
