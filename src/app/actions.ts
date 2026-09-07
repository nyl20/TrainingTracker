"use server";

import { db } from "@/db";
import { students, sessions, progressLogs, coaches } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { getCurrentCoach } from "@/lib/current-coach";

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function addStudent(formData: FormData) {
  const coach = await getCurrentCoach();
  if (!coach) return;

  const name = formData.get("name");
  const clubId = formData.get("clubId");
  if (typeof name !== "string" || name.trim() === "") return;
  if (typeof clubId !== "string" || !coach.clubs.some((c) => c.id === clubId)) {
    return;
  }

  await db.insert(students).values({
    name: name.trim(),
    clubId,
    startDate: today(),
    arm: optionalText(formData, "arm"),
  });
  revalidatePath("/");
  revalidatePath("/settings");
}

export async function addSession(
  _prevState: { addedName: string | null },
  formData: FormData,
) {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") {
    return { addedName: null };
  }

  await db.insert(sessions).values({ name: name.trim() });
  revalidatePath("/settings");
  revalidatePath("/progress/new");
  return { addedName: name.trim() };
}

export async function addProgressLog(formData: FormData) {
  const coach = await getCurrentCoach();
  if (!coach) return;

  const studentIds = formData
    .getAll("studentIds")
    .filter((v): v is string => typeof v === "string" && v !== "");
  const sessionId = formData.get("sessionId");
  const coachId = formData.get("coachId");
  const date = formData.get("date");

  if (
    studentIds.length === 0 ||
    typeof sessionId !== "string" ||
    sessionId === "" ||
    typeof coachId !== "string" ||
    coachId === "" ||
    typeof date !== "string" ||
    date === ""
  ) {
    return;
  }

  const myClubIds = coach.clubs.map((c) => c.id);

  const candidateStudents = await db.query.students.findMany({
    where: inArray(students.id, studentIds),
  });
  const authorizedStudentIds = candidateStudents
    .filter((s) => myClubIds.includes(s.clubId))
    .map((s) => s.id);
  if (authorizedStudentIds.length === 0) return;

  const teachingCoach = await db.query.coaches.findFirst({
    where: eq(coaches.id, coachId),
    with: { coachClubs: true },
  });
  const teachingCoachSharesClub = teachingCoach?.coachClubs.some((cc) =>
    myClubIds.includes(cc.clubId),
  );
  if (!teachingCoachSharesClub) return;

  const theme = optionalText(formData, "theme");
  const workedOn = optionalText(formData, "workedOn");
  const two = optionalText(formData, "two");
  const comments = optionalText(formData, "comments");

  await db.insert(progressLogs).values(
    authorizedStudentIds.map((studentId) => ({
      studentId,
      sessionId,
      coachId,
      date,
      theme,
      workedOn,
      two,
      comments,
    })),
  );

  revalidatePath("/");
  if (authorizedStudentIds.length === 1) {
    revalidatePath(`/students/${authorizedStudentIds[0]}`);
    redirect(`/students/${authorizedStudentIds[0]}`);
  }
  redirect(`/?logged=${authorizedStudentIds.length}`);
}
