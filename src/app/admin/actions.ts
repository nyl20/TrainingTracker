"use server";

import { db } from "@/db";
import { clubs, coachClubs, sessions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentCoach } from "@/lib/current-coach";

export async function approveCoachClub(formData: FormData) {
  const coach = await getCurrentCoach();
  if (!coach?.isAdmin) return;

  const coachId = formData.get("coachId");
  const clubId = formData.get("clubId");
  if (typeof coachId !== "string" || typeof clubId !== "string") return;

  await db
    .update(coachClubs)
    .set({ status: "approved" })
    .where(and(eq(coachClubs.coachId, coachId), eq(coachClubs.clubId, clubId)));

  revalidatePath("/admin");
}

export async function rejectCoachClub(formData: FormData) {
  const coach = await getCurrentCoach();
  if (!coach?.isAdmin) return;

  const coachId = formData.get("coachId");
  const clubId = formData.get("clubId");
  if (typeof coachId !== "string" || typeof clubId !== "string") return;

  await db
    .delete(coachClubs)
    .where(and(eq(coachClubs.coachId, coachId), eq(coachClubs.clubId, clubId)));

  revalidatePath("/admin");
}

export async function addClub(
  _prevState: { addedName: string | null },
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  if (!coach?.isAdmin) return { addedName: null };

  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") return { addedName: null };

  const existing = await db.query.clubs.findFirst({
    where: eq(clubs.name, name.trim()),
  });
  if (existing) return { addedName: null };

  await db.insert(clubs).values({ name: name.trim() });
  revalidatePath("/admin");
  revalidatePath("/signup");
  return { addedName: name.trim() };
}

export async function addSession(
  _prevState: { addedName: string | null },
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  if (!coach?.isAdmin) return { addedName: null };

  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") {
    return { addedName: null };
  }

  await db.insert(sessions).values({ name: name.trim() });
  revalidatePath("/admin");
  revalidatePath("/progress/new");
  return { addedName: name.trim() };
}
