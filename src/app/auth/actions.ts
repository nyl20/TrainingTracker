"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { coaches, clubs, coachClubs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") return;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/signin?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const clubsInput = formData.get("clubs");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof clubsInput !== "string" ||
    clubsInput.trim() === ""
  ) {
    return;
  }

  const clubNames = Array.from(
    new Set(
      clubsInput
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== ""),
    ),
  );
  if (clubNames.length === 0) return;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    redirect(
      `/signup?error=${encodeURIComponent(error?.message ?? "Sign up failed")}`,
    );
  }

  const [coach] = await db
    .insert(coaches)
    .values({ authUserId: data.user.id, name: name.trim() })
    .returning();

  for (const clubName of clubNames) {
    let club = await db.query.clubs.findFirst({
      where: eq(clubs.name, clubName),
    });
    if (!club) {
      [club] = await db.insert(clubs).values({ name: clubName }).returning();
    }
    await db.insert(coachClubs).values({ coachId: coach.id, clubId: club.id });
  }

  if (data.session) {
    redirect("/");
  }

  redirect(
    `/signin?message=${encodeURIComponent(
      "Check your email to confirm your account, then sign in.",
    )}`,
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/signin");
}
