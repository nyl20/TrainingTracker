import { db } from "@/db";
import { students, coaches, coachClubs, sessions } from "@/db/schema";
import { inArray, eq } from "drizzle-orm";
import { addProgressLog } from "@/app/actions";
import { getCurrentCoach } from "@/lib/current-coach";
import { redirect } from "next/navigation";
import StudentPicker from "@/components/StudentPicker";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export default async function NewProgressLogPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");

  const myClubIds = coach.clubs.map((c) => c.id);

  const { studentId } = await searchParams;

  const [myStudents, sharedCoachRows, allSessions] = await Promise.all([
    myClubIds.length > 0
      ? db.select().from(students).where(inArray(students.clubId, myClubIds))
      : Promise.resolve([]),
    myClubIds.length > 0
      ? db
          .select({ id: coaches.id, name: coaches.name })
          .from(coachClubs)
          .innerJoin(coaches, eq(coachClubs.coachId, coaches.id))
          .where(inArray(coachClubs.clubId, myClubIds))
      : Promise.resolve([]),
    db.select().from(sessions),
  ]);

  const myCoaches = Array.from(
    new Map(sharedCoachRows.map((c) => [c.id, c])).values(),
  );

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          New progress log
        </h1>

        <form action={addProgressLog} className="mt-6 flex flex-col gap-2">
          <label className="text-sm text-zinc-500">
            Students
            <div className="mt-1">
              <StudentPicker students={myStudents} defaultStudentId={studentId} />
            </div>
          </label>

          <label className="text-sm text-zinc-500">
            Session
            <select
              name="sessionId"
              required
              defaultValue=""
              className={`mt-1 w-full ${inputClass}`}
            >
              <option value="" disabled>
                Select a session
              </option>
              {allSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-zinc-500">
            Coach
            <select
              name="coachId"
              required
              defaultValue={coach.id}
              className={`mt-1 w-full ${inputClass}`}
            >
              <option value="" disabled>
                Select a coach
              </option>
              {myCoaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-zinc-500">
            Date
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={`mt-1 w-full ${inputClass}`}
            />
          </label>

          <label className="text-sm text-zinc-500">
            Theme
            <input name="theme" className={`mt-1 w-full ${inputClass}`} />
          </label>

          <label className="text-sm text-zinc-500">
            Worked on
            <textarea name="workedOn" rows={2} className={`mt-1 w-full ${inputClass}`} />
          </label>

          <label className="text-sm text-zinc-500">
            To work on next
            <textarea name="two" rows={2} className={`mt-1 w-full ${inputClass}`} />
          </label>

          <label className="text-sm text-zinc-500">
            Comments
            <textarea name="comments" rows={2} className={`mt-1 w-full ${inputClass}`} />
          </label>

          <button
            type="submit"
            className="mt-2 rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Save progress log
          </button>
        </form>
      </main>
    </div>
  );
}
