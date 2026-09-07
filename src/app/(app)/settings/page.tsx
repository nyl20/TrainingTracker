import { getCurrentCoach } from "@/lib/current-coach";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import AddStudentForm from "@/components/AddStudentForm";
import AddSessionForm from "@/components/AddSessionForm";

const summaryClass =
  "cursor-pointer list-none text-lg font-medium text-black marker:content-none dark:text-zinc-50 [&::-webkit-details-marker]:hidden";

export default async function SettingsPage() {
  const coach = await getCurrentCoach();
  if (!coach) redirect("/signin");

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Settings
        </h1>

        <details className="mt-8 group" open>
          <summary className={summaryClass}>
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            Add student
          </summary>
          {coach.clubs.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              You&apos;re not part of any clubs yet.
            </p>
          ) : (
            <AddStudentForm clubs={coach.clubs} />
          )}
        </details>

        <details className="mt-6 group">
          <summary className={summaryClass}>
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            Add session
          </summary>
          <AddSessionForm />
        </details>

        <form action={signOut} className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            type="submit"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Sign out
          </button>
        </form>
      </main>
    </div>
  );
}
