"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase";
import { getUserProfile, ensureUserProfile, UserProfile } from "@/lib/user-profile";

type AppSupabaseClient = ReturnType<typeof createClient>;

interface AuthContextType {
    supabase: AppSupabaseClient;
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    openModal: "login" | "register" | null;
    setOpenModal: (modal: "login" | "register" | null) => void;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (
        email: string,
        password: string,
        username: string
    ) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
    signOut: () => Promise<void>;
    username: string;
    profile: UserProfile | null;
    refreshProfile: () => Promise<void>;
    applyProfileUpdate: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient());
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState<"login" | "register" | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const signingInRef = useRef(false);
    const { setTheme } = useTheme();

    const fetchProfile = useCallback(
        async (userId: string) => {
            try {
                const p = await ensureUserProfile(supabase, userId);
                setProfile(p);
            } catch {
                // Profile table might not exist yet, silently fail
                setProfile(null);
            }
        },
        [supabase]
    );

    const refreshProfile = useCallback(async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    }, [user, fetchProfile]);

    const applyProfileUpdate = useCallback((updates: Partial<UserProfile>) => {
        setProfile((current) => (current ? { ...current, ...updates } : current));
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // Skip state updates while signIn is checking deactivation
            if (signingInRef.current) return;

            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile]);

    // Sync theme from user profile ONLY when logged in with a saved preference.
    // When logged out, let next-themes handle it naturally (keeps manual toggle working).
    useEffect(() => {
        if (isLoading || !user || !profile) return;

        if (profile.theme_preference) {
            setTheme(profile.theme_preference);
        }
    }, [isLoading, user, profile?.theme_preference, setTheme]);

    const signIn = useCallback(
        async (email: string, password: string) => {
            signingInRef.current = true;
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    signingInRef.current = false;
                    return { error: error.message };
                }

                // Check if account is deactivated
                if (data.user) {
                    try {
                        const { data: profileData } = await supabase
                            .from("user_profiles")
                            .select("deactivated_at")
                            .eq("id", data.user.id)
                            .maybeSingle() as { data: { deactivated_at: string | null } | null };

                        if (profileData?.deactivated_at) {
                            await supabase.auth.signOut();
                            signingInRef.current = false;
                            return {
                                error: "Your account has been deactivated. Please contact support to reactivate it.",
                            };
                        }
                    } catch {
                        // Profile check failed, allow login
                    }
                }

                // Allow the auth state to propagate now
                signingInRef.current = false;
                setSession(data.session);
                setUser(data.user);
                if (data.user) {
                    fetchProfile(data.user.id);
                }
                setOpenModal(null);
                return { error: null };
            } catch {
                signingInRef.current = false;
                return { error: "An unexpected error occurred" };
            }
        },
        [supabase, fetchProfile]
    );

    const signUp = useCallback(
        async (email: string, password: string, username: string) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                },
            });
            if (error) return { error: error.message };

            // If Supabase returned a session, user is auto-logged in (email confirmation disabled)
            // If no session, email confirmation is required
            const hasSession = !!data.session;
            if (hasSession) {
                setOpenModal(null);
            }
            return { error: null, needsConfirmation: !hasSession };
        },
        [supabase]
    );

    const signOutFn = useCallback(async () => {
        await supabase.auth.signOut();
        setProfile(null);
        // Clear Jikan API cache to prevent stale sensitive-content data
        if (typeof window !== "undefined") {
            sessionStorage.clear();
        }
    }, [supabase]);

    const username =
        user?.user_metadata?.username ??
        user?.email?.split("@")[0] ??
        "usuario";

    return (
        <AuthContext.Provider
            value={{
                supabase,
                user,
                session,
                isLoading,
                openModal,
                setOpenModal,
                signIn,
                signUp,
                signOut: signOutFn,
                username,
                profile,
                refreshProfile,
                applyProfileUpdate,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
