"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { exportUserData, deactivateAccount } from "@/lib/user-profile";
import type { SupabaseClient } from "@supabase/supabase-js";

interface DangerZoneSectionProps {
    supabase: SupabaseClient;
    userId: string;
}

export default function DangerZoneSection({ supabase, userId }: DangerZoneSectionProps) {
    const router = useRouter();
    const [exporting, setExporting] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const jsonData = await exportUserData(supabase, userId);
            if (!jsonData) {
                toast.error("Your list is empty", {
                    description: "Add some anime to your list before exporting.",
                });
                setExporting(false);
                return;
            }
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `sorai-my-list-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Data exported", { description: "Your anime list has been downloaded." });
        } catch {
            toast.error("Failed to export data");
        }
        setExporting(false);
    };

    const handleDeactivate = async () => {
        setDeactivating(true);
        try {
            await deactivateAccount(supabase, userId);
            await supabase.auth.signOut();
            toast.success("Account deactivated", {
                description: "Your account has been deactivated. Contact support to reactivate.",
            });
            router.push("/");
        } catch {
            toast.error("Failed to deactivate account");
        }
        setDeactivating(false);
        setShowConfirm(false);
    };

    return (
        <>
            {/* Export Data */}
            <section className="bg-surface rounded-2xl border border-border p-6">
                <h2 className="text-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Download size={16} className="text-primary" />
                    Your Data
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                    Download your anime list as a JSON file including titles, status, scores, and dates.
                </p>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="px-5 h-10 text-sm font-medium text-primary border-2 border-primary rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    Export Anime List
                </button>
            </section>

            {/* Danger Zone */}
            <section
                className="rounded-2xl border-2 p-6"
                style={{ borderColor: "var(--color-error)" }}
            >
                <h2 className="text-md font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-error)" }}>
                    <AlertTriangle size={16} />
                    Danger Zone
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                    Deactivating your account will sign you out and hide your profile. Your data will be preserved and you can reactivate by contacting support.
                </p>

                {!showConfirm ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="px-5 h-10 text-sm font-medium rounded-xl border-2 transition-colors flex items-center gap-2"
                        style={{
                            color: "var(--color-error)",
                            borderColor: "var(--color-error)",
                        }}
                    >
                        <AlertTriangle size={14} />
                        Deactivate Account
                    </button>
                ) : (
                    <div
                        className="rounded-xl p-4 space-y-3"
                        style={{ backgroundColor: "rgba(220, 38, 38, 0.05)" }}
                    >
                        <p className="text-sm font-medium" style={{ color: "var(--color-error)" }}>
                            Are you sure? This action will sign you out immediately.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeactivate}
                                disabled={deactivating}
                                className="px-5 h-10 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                style={{ backgroundColor: "var(--color-error)" }}
                            >
                                {deactivating ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                                Yes, deactivate
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-5 h-10 text-sm text-text-secondary border border-border rounded-xl hover:bg-surface-alt transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
