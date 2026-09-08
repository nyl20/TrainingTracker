import { db } from "@/db";
import { coachClubs, coaches, clubs, authUsers, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/current-coach";
import { approveCoachClub, rejectCoachClub } from "@/app/admin/actions";
import AddClubForm from "@/components/AddClubForm";
import AddSessionForm from "@/components/AddSessionForm";

const buttonClass =
  "rounded px-3 py-1.5 text-sm font-medium text-white dark:text-black";

export default async function AdminPage() {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");
  if (!coach.isAdmin) redirect("/");

  const pendingRequests = await db
    .select({
      coachId: coachClubs.coachId,
      clubId: coachClubs.clubId,
      coachName: coaches.name,
      coachEmail: authUsers.email,
      clubName: clubs.name,
    })
    .from(coachClubs)
    .innerJoin(coaches, eq(coachClubs.coachId, coaches.id))
    .innerJoin(clubs, eq(coachClubs.clubId, clubs.id))
    .innerJoin(authUsers, eq(coaches.authUserId, authUsers.id))
    .where(eq(coachClubs.status, "pending"));

  const allClubs = await db.select().from(clubs);
  const allSessions = await db.select().from(sessions);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Admin
        </h1>

        <section className="mt-8">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            Pending join requests
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {pendingRequests.map((req) => (
              <li
                key={`${req.coachId}-${req.clubId}`}
                className="rounded border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="font-medium">{req.coachName}</div>
                <div className="text-zinc-500">{req.coachEmail}</div>
                <div className="mt-1">
                  wants to join <span className="font-medium">{req.clubName}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <form action={approveCoachClub}>
                    <input type="hidden" name="coachId" value={req.coachId} />
                    <input type="hidden" name="clubId" value={req.clubId} />
                    <button
                      type="submit"
                      className={`${buttonClass} bg-black dark:bg-white`}
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectCoachClub}>
                    <input type="hidden" name="coachId" value={req.coachId} />
                    <input type="hidden" name="clubId" value={req.clubId} />
                    <button
                      type="submit"
                      className={`${buttonClass} border border-zinc-300 !text-black dark:border-zinc-700 dark:!text-zinc-50`}
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {pendingRequests.length === 0 && (
              <li className="text-sm text-zinc-500">No pending requests.</li>
            )}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            Add club
          </h2>
          <AddClubForm />
          <ul className="mt-3 flex flex-col gap-1 text-sm text-zinc-500">
            {allClubs.map((club) => (
              <li key={club.id}>{club.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            Add session
          </h2>
          <AddSessionForm />
          <ul className="mt-3 flex flex-col gap-1 text-sm text-zinc-500">
            {allSessions.map((session) => (
              <li key={session.id}>{session.name}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
