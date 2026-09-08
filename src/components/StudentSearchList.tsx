"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type StudentRow = {
  id: string;
  name: string;
  startDate: string | null;
  arm: string | null;
};

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export default function StudentSearchList({
  students,
}: {
  students: StudentRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, students]);

  return (
    <div>
      {students.length > 5 && (
        <input
          type="text"
          placeholder="Search students…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`mt-6 w-full ${inputClass}`}
        />
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {filtered.map((student) => (
          <li key={student.id}>
            <Link
              href={`/students/${student.id}`}
              className="block rounded border border-zinc-200 bg-white px-4 py-3 text-sm hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="font-medium">{student.name}</div>
              <div className="text-zinc-500">
                {[student.startDate, student.arm].filter(Boolean).join(" · ")}
              </div>
            </Link>
          </li>
        ))}
        {students.length > 0 && filtered.length === 0 && (
          <li className="text-sm text-zinc-500">No matches.</li>
        )}
        {students.length === 0 && (
          <li className="text-sm text-zinc-500">
            No students yet. Add one from Settings.
          </li>
        )}
      </ul>
    </div>
  );
}
