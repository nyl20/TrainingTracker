"use client";

import { useMemo, useState } from "react";

type StudentOption = { id: string; name: string };

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export default function StudentPicker({
  students,
  defaultStudentId,
}: {
  students: StudentOption[];
  defaultStudentId?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    defaultStudentId ? [defaultStudentId] : [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, students]);

  const selected = students.filter((s) => selectedIds.includes(s.id));

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div>
      {selected.map((s) => (
        <input key={s.id} type="hidden" name="studentIds" value={s.id} />
      ))}

      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {selected.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 rounded-full bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-800"
            >
              {s.name}
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-label={`Remove ${s.name}`}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Search students…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full ${inputClass}`}
      />

      <div className="mt-1 max-h-48 overflow-y-auto rounded border border-zinc-300 dark:border-zinc-700">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
            className={`block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
              selectedIds.includes(s.id)
                ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                : ""
            }`}
          >
            {s.name}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-sm text-zinc-500">No matches</p>
        )}
      </div>
    </div>
  );
}
