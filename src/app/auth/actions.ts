"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { coaches, clubs, coachClubs } from "@/db/schema";
import { inArray } from "drizzle-orm";
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
  const clubIds = formData
    .getAll("clubIds")
    .filter((v): v is string => typeof v === "string" && v !== "");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    name.trim() === "" ||
    clubIds.length === 0
  ) {
    return;
  }

  const validClubs = await db.query.clubs.findMany({
    where: inArray(clubs.id, clubIds),
  });
  if (validClubs.length === 0) return;

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

  await db.insert(coachClubs).values(
    validClubs.map((club) => ({
      coachId: coach.id,
      clubId: club.id,
      status: "pending" as const,
    })),
  );

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
