import Link from "next/link";
import { getCurrentCoach } from "@/lib/current-coach";

export default async function Header() {
  const coach = await getCurrentCoach();

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
      <Link
        href="/"
        className="text-lg font-semibold text-black dark:text-zinc-50"
      >
        TrainingTracker
      </Link>
      <div className="flex items-center gap-3">
        {coach?.isAdmin && (
          <Link
            href="/admin"
            aria-label="Admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
        <Link
          href="/progress/new"
          aria-label="Log a new progress entry"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
          </svg>
        </Link>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.213 1.06a6.99 6.99 0 0 1 1.759 1.017l1.03-.35a1 1 0 0 1 1.196.457l.68 1.178a1 1 0 0 1-.223 1.257l-.822.72a7.019 7.019 0 0 1 0 2.033l.822.72a1 1 0 0 1 .223 1.257l-.68 1.178a1 1 0 0 1-1.196.457l-1.03-.35a6.99 6.99 0 0 1-1.759 1.017l-.213 1.06a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.213-1.06a6.99 6.99 0 0 1-1.759-1.017l-1.03.35a1 1 0 0 1-1.196-.457l-.68-1.178a1 1 0 0 1 .223-1.257l.822-.72a7.019 7.019 0 0 1 0-2.033l-.822-.72a1 1 0 0 1-.223-1.257l.68-1.178a1 1 0 0 1 1.196-.457l1.03.35A6.99 6.99 0 0 1 8.127 2.864l.213-1.06ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
