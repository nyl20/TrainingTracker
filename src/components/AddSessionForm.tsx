"use client";

import { useActionState } from "react";
import { addSession } from "@/app/actions";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black";

export default function AddSessionForm() {
  const [state, formAction, pending] = useActionState(addSession, {
    addedName: null,
  });

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2">
      <input
        key={state.addedName ?? "empty"}
        name="name"
        placeholder="Session name"
        required
        className={inputClass}
      />
      <button type="submit" disabled={pending} className={buttonClass}>
        Add session
      </button>
      {state.addedName && (
        <p
          key={state.addedName}
          className="animate-fade-out-message flex items-center gap-1 text-sm text-green-600 dark:text-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.792 6.793-6.793a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {state.addedName} added
        </p>
      )}
    </form>
  );
}
