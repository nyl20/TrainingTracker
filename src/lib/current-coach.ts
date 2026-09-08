import { db } from "@/db";
import { coaches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentCoach() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const coach = await db.query.coaches.findFirst({
    where: eq(coaches.authUserId, user.id),
    with: { coachClubs: { with: { club: true } } },
  });
  if (!coach) return null;

  return {
    id: coach.id,
    name: coach.name,
    isAdmin: coach.isAdmin,
    clubs: coach.coachClubs
      .filter((cc) => cc.status === "approved")
      .map((cc) => cc.club),
    pendingClubs: coach.coachClubs
      .filter((cc) => cc.status === "pending")
      .map((cc) => cc.club),
  };
}
