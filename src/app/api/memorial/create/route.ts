import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, memorialData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!memorialData.full_name) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = memorialData.full_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now();

    // Use server-side Supabase with service role to bypass RLS
    const { data, error } = await supabase
      .from("memorials")
      .insert({
        user_id: userId,
        full_name: memorialData.full_name,
        slug,
        status: "draft",
        privacy: memorialData.privacy || "public",
        allow_tributes: memorialData.allow_tributes ?? true,
        ...(memorialData.date_of_birth && { date_of_birth: memorialData.date_of_birth }),
        ...(memorialData.date_of_death && { date_of_death: memorialData.date_of_death }),
        ...(memorialData.age_at_death && { age_at_death: memorialData.age_at_death }),
        ...(memorialData.profile_photo_url && { profile_photo_url: memorialData.profile_photo_url }),
        ...(memorialData.verse && { verse: memorialData.verse }),
        ...(memorialData.obituary_short && { obituary_short: memorialData.obituary_short }),
        ...(memorialData.obituary_full && { obituary_full: memorialData.obituary_full }),
        ...(memorialData.allow_donations !== undefined && { allow_donations: memorialData.allow_donations }),
        ...(memorialData.donation_link && { donation_link: memorialData.donation_link }),
        ...(memorialData.rsvp_enabled !== undefined && { rsvp_enabled: memorialData.rsvp_enabled }),
        ...(memorialData.rsvp_event_date && { rsvp_event_date: memorialData.rsvp_event_date }),
        ...(memorialData.rsvp_event_time && { rsvp_event_time: memorialData.rsvp_event_time }),
        ...(memorialData.rsvp_event_location && { rsvp_event_location: memorialData.rsvp_event_location }),
        ...(memorialData.rsvp_event_details && { rsvp_event_details: memorialData.rsvp_event_details }),
      })
      .select()
      .single();

    if (error) {
      console.error("Server-side insert error:", error);
      return NextResponse.json(
        {
          error: error.message || "Failed to create memorial",
          details: error,
          errorCode: error.code,
          errorHint: error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
