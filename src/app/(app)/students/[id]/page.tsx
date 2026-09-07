import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/current-coach";
import DeleteStudentButton from "@/components/DeleteStudentButton";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");

  const { id } = await params;

  const student = await db.query.students.findFirst({
    where: eq(students.id, id),
    with: {
      club: true,
      progressLogs: {
        with: { session: true, coach: true },
        orderBy: (progressLogs, { desc }) => [desc(progressLogs.date)],
      },
    },
  });

  if (!student || !coach.clubs.some((c) => c.id === student.clubId)) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Students
        </Link>

        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {student.name}
            </h1>
            <p className="text-sm text-zinc-500">
              {[student.club.name, student.startDate, student.arm]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <DeleteStudentButton studentId={student.id} studentName={student.name} />
        </div>

        <h2 className="mt-8 text-lg font-medium text-black dark:text-zinc-50">
          Progress logs
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {student.progressLogs.map((log) => (
            <li
              key={log.id}
              className="rounded border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{log.session.name}</span>
                <span className="text-zinc-500">{log.date}</span>
              </div>
              <div className="mt-1 text-zinc-500">Coach: {log.coach.name}</div>
              {log.theme && (
                <div className="mt-2">
                  <span className="font-medium">Theme: </span>
                  {log.theme}
                </div>
              )}
              {log.workedOn && (
                <div className="mt-1">
                  <span className="font-medium">Worked on: </span>
                  {log.workedOn}
                </div>
              )}
              {log.two && (
                <div className="mt-1">
                  <span className="font-medium">To work on next: </span>
                  {log.two}
                </div>
              )}
              {log.comments && (
                <div className="mt-1">
                  <span className="font-medium">Comments: </span>
                  {log.comments}
                </div>
              )}
            </li>
          ))}
          {student.progressLogs.length === 0 && (
            <li className="text-sm text-zinc-500">No progress logs yet.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
