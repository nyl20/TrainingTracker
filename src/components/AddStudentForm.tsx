"use client";

import { useState } from "react";
import { addStudent } from "@/app/actions";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black";

export default function AddStudentForm({
  clubs,
}: {
  clubs: { id: string; name: string }[];
}) {
  const [name, setName] = useState("");

  return (
    <form action={addStudent} className="mt-3 flex flex-col gap-2">
      <input
        name="name"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <select name="clubId" required defaultValue="" className={inputClass}>
        <option value="" disabled>
          Select a club
        </option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
      <input name="arm" placeholder="Arm" className={inputClass} />
      <button type="submit" disabled={name.trim() === ""} className={buttonClass}>
        Add student
      </button>
    </form>
  );
}
