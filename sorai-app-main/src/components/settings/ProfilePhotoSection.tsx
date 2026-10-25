"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar, removeAvatar } from "@/lib/user-profile";
import { validateAvatarFile } from "@/lib/validators";
import type { SupabaseClient } from "@supabase/supabase-js";

interface ProfilePhotoSectionProps {
    supabase: SupabaseClient;
    userId: string;
    avatarUrl: string | null;
    initial: string;
    refreshProfile: () => Promise<void>;
}

export default function ProfilePhotoSection({
    supabase,
    userId,
    avatarUrl,
    initial,
    refreshProfile,
}: ProfilePhotoSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileError = validateAvatarFile(file);
        if (fileError) {
            toast.error("Invalid file", { description: fileError });
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploading(true);
        try {
            await uploadAvatar(supabase, userId, file);
            await refreshProfile();
            toast.success("Profile photo updated");
        } catch {
            toast.error("Failed to upload photo");
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = async () => {
        setUploading(true);
        try {
            await removeAvatar(supabase, userId);
            await refreshProfile();
            toast.success("Profile photo removed");
        } catch {
            toast.error("Failed to remove photo");
        }
        setUploading(false);
    };

    return (
        <section className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                Profile Photo
            </h2>
            <div className="flex items-start gap-5">
                <div className="relative">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-28 h-28 rounded-2xl object-cover border-2 border-border"
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                            }}
                        >
                            {initial}
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                            <Loader2 size={20} className="text-white animate-spin" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 h-9 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                        }}
                    >
                        Upload photo
                    </button>
                    {avatarUrl && (
                        <button
                            onClick={handleRemove}
                            disabled={uploading}
                            className="px-4 h-9 text-sm text-text-secondary border border-border rounded-xl hover:bg-surface-alt transition-colors disabled:opacity-50"
                        >
                            Remove
                        </button>
                    )}
                    <p className="text-xs text-text-secondary">JPG, PNG or WebP. Max 2MB.</p>
                </div>
            </div>
        </section>
    );
}
