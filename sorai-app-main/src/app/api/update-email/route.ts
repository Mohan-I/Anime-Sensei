import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validators";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Validate email format server-side using shared validator
        const emailError = validateEmail(email);
        if (emailError) {
            return NextResponse.json({ error: emailError }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            console.error("SUPABASE_SERVICE_ROLE_KEY is not configured");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Verify the user's token first
        const anonClient = createClient(
            supabaseUrl,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user }, error: authError } = await anonClient.auth.getUser(
            authHeader.replace("Bearer ", "")
        );
        if (authError || !user) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // Rate limit: max 3 email changes per minute per user
        const { success } = rateLimit(`update-email:${user.id}`, 3, 60 * 1000);
        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // Use admin client to update email without confirmation
        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        const { error: updateError } = await adminClient.auth.admin.updateUserById(
            user.id,
            { email: email.trim() }
        );

        if (updateError) {
            console.error("Failed to update email:", updateError.message);
            return NextResponse.json({ error: "Failed to update email. Please try again." }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
