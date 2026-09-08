import { db } from "@/db";
import { students } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/current-coach";
import StudentSearchList from "@/components/StudentSearchList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ club?: string; logged?: string }>;
}) {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");

  const { club: clubParam, logged } = await searchParams;
  const activeClubId =
    clubParam && coach.clubs.some((c) => c.id === clubParam)
      ? clubParam
      : coach.clubs[0]?.id;

  const activeStudents = activeClubId
    ? await db
        .select()
        .from(students)
        .where(eq(students.clubId, activeClubId))
        .orderBy(desc(students.createdAt))
    : [];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Students
        </h1>

        {logged && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-500">
            Logged progress for {logged} student{logged === "1" ? "" : "s"}.
          </p>
        )}

        {coach.clubs.length === 0 && coach.pendingClubs.length === 0 && (
          <p className="mt-6 text-sm text-zinc-500">
            You&apos;re not part of any clubs yet.
          </p>
        )}

        {coach.pendingClubs.length > 0 && (
          <p className="mt-6 text-sm text-zinc-500">
            Waiting on admin approval for:{" "}
            {coach.pendingClubs.map((c) => c.name).join(", ")}
          </p>
        )}

        {coach.clubs.length > 0 && (
          <div className="mt-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
            {coach.clubs.map((club) => (
              <Link
                key={club.id}
                href={`/?club=${club.id}`}
                className={`-mb-px border-b-2 px-3 py-2 text-sm ${
                  club.id === activeClubId
                    ? "border-black font-medium text-black dark:border-white dark:text-zinc-50"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {club.name}
              </Link>
            ))}
          </div>
        )}

        {activeClubId && <StudentSearchList students={activeStudents} />}
      </main>
    </div>
  );
}
