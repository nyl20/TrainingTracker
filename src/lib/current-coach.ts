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
    clubs: coach.coachClubs.map((cc) => cc.club),
  };
}
