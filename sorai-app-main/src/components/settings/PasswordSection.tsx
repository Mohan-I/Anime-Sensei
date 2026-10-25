"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validatePassword, validateConfirmPassword } from "@/lib/validators";
import type { SupabaseClient } from "@supabase/supabase-js";

interface PasswordSectionProps {
    supabase: SupabaseClient;
}

export default function PasswordSection({ supabase }: PasswordSectionProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handlePasswordChange = (value: string) => {
        setNewPassword(value);
        if (value) {
            setPasswordError(validatePassword(value));
            if (confirmPassword) {
                setConfirmPasswordError(validateConfirmPassword(value, confirmPassword));
            }
        } else {
            setPasswordError(null);
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setConfirmPasswordError(value ? validateConfirmPassword(newPassword, value) : null);
    };

    const handleSave = async () => {
        const pwError = validatePassword(newPassword);
        const cpError = validateConfirmPassword(newPassword, confirmPassword);
        setPasswordError(pwError);
        setConfirmPasswordError(cpError);
        if (pwError || cpError) return;

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success("Password updated");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setConfirmPasswordError(null);
        } catch {
            toast.error("Failed to update password");
        }
        setSaving(false);
    };

    return (
        <section className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-md font-semibold text-text-primary mb-5 flex items-center gap-2">
                <Lock size={16} className="text-primary" />
                Password
            </h2>
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="Min 8 characters"
                            maxLength={64}
                            className="w-full h-10 px-4 pr-10 bg-surface-hover rounded-xl border border-border text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>
                <div>
                    <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                            placeholder="Repeat new password"
                            maxLength={64}
                            className="w-full h-10 px-4 pr-10 bg-surface-hover rounded-xl border border-border text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !newPassword || !confirmPassword}
                    className="px-5 h-10 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2 mt-2"
                    style={{
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                    }}
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    Update Password
                </button>
            </div>
        </section>
    );
}
