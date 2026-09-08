import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/current-coach";
import { updateStudent } from "@/app/actions";
import DeleteStudentButton from "@/components/DeleteStudentButton";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");

  const { id } = await params;

  const student = await db.query.students.findFirst({
    where: eq(students.id, id),
  });

  if (!student || !coach.clubs.some((c) => c.id === student.clubId)) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md">
        <Link
          href={`/students/${id}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← {student.name}
        </Link>

        <h1 className="mt-2 text-2xl font-semibold text-black dark:text-zinc-50">
          Edit student
        </h1>

        <form action={updateStudent} className="mt-6 flex flex-col gap-2">
          <input type="hidden" name="studentId" value={student.id} />
          <input
            name="name"
            defaultValue={student.name}
            required
            className={inputClass}
          />
          <select
            name="clubId"
            defaultValue={student.clubId}
            required
            className={inputClass}
          >
            {coach.clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
          <input
            name="startDate"
            type="date"
            defaultValue={student.startDate ?? ""}
            className={inputClass}
          />
          <select
            name="arm"
            defaultValue={student.arm ?? ""}
            className={inputClass}
          >
            <option value="">Arm (optional)</option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
          <button type="submit" className={buttonClass}>
            Save changes
          </button>
        </form>

        <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-500"></p>
          <DeleteStudentButton studentId={student.id} studentName={student.name} />
        </div>
      </main>
    </div>
  );
}
