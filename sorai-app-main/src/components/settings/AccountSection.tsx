"use client";

import { useState } from "react";
import { User as UserIcon, Mail, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateUsername, validateEmail } from "@/lib/validators";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AccountSectionProps {
    supabase: SupabaseClient;
    user: { id: string; email?: string; user_metadata?: { username?: string } };
    username: string | null;
}

export default function AccountSection({ supabase, user, username }: AccountSectionProps) {
    const [newUsername, setNewUsername] = useState(user.user_metadata?.username || "");
    const [newEmail, setNewEmail] = useState(user.email || "");
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [savingUsername, setSavingUsername] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);

    const handleUsernameChange = (value: string) => {
        setNewUsername(value);
        setUsernameError(value ? validateUsername(value) : null);
    };

    const handleSaveUsername = async () => {
        const error = validateUsername(newUsername);
        if (error) { setUsernameError(error); return; }
        if (newUsername.trim() === username) return;

        setSavingUsername(true);
        try {
            const { error: err } = await supabase.auth.updateUser({
                data: { username: newUsername.trim() },
            });
            if (err) throw err;
            setUsernameError(null);
            toast.success("Username updated");
        } catch {
            toast.error("Failed to update username");
        }
        setSavingUsername(false);
    };

    const handleEmailChange = (value: string) => {
        setNewEmail(value);
        setEmailError(value ? validateEmail(value) : null);
    };

    const handleSaveEmail = async () => {
        const error = validateEmail(newEmail);
        if (error) { setEmailError(error); return; }
        if (newEmail.trim() === user.email) return;

        setSavingEmail(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/update-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ email: newEmail.trim() }),
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error("Failed to update email", {
                    description: result.error || "Unknown error",
                });
            } else {
                setEmailError(null);
                toast.success("Email updated successfully");
                await supabase.auth.refreshSession();
            }
        } catch {
            toast.error("Failed to update email");
        }
        setSavingEmail(false);
    };

    return (
        <section className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-md font-semibold text-text-primary mb-5 flex items-center gap-2">
                <UserIcon size={16} className="text-primary" />
                Account
            </h2>
            <div className="space-y-5">
                {/* Username */}
                <div>
                    <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        Username
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            maxLength={20}
                            className="flex-1 h-10 px-4 bg-surface-hover rounded-xl border border-border text-sm text-text-primary focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            onClick={handleSaveUsername}
                            disabled={savingUsername || newUsername.trim() === username || !!usernameError}
                            className="px-4 h-10 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                            }}
                        >
                            {savingUsername ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Save
                        </button>
                    </div>
                    {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        <div className="flex items-center gap-1.5">
                            <Mail size={13} />
                            Email
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            maxLength={254}
                            className="flex-1 h-10 px-4 bg-surface-hover rounded-xl border border-border text-sm text-text-primary focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            onClick={handleSaveEmail}
                            disabled={savingEmail || newEmail.trim() === user.email || !!emailError}
                            className="px-4 h-10 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                            }}
                        >
                            {savingEmail ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Save
                        </button>
                    </div>
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
            </div>
        </section>
    );
}
