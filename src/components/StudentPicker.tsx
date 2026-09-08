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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students.filter(
      (s) => !selectedIds.includes(s.id) && s.name.toLowerCase().includes(q),
    );
  }, [query, students, selectedIds]);

  const selected = students.filter((s) => selectedIds.includes(s.id));

  function select(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
  }

  function remove(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
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
              className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {s.name}
              <button
                type="button"
                onClick={() => remove(s.id)}
                aria-label={`Remove ${s.name}`}
                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Search students…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full ${inputClass}`}
        />

        {query.trim() !== "" && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {matches.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(s.id)}
                className="block w-full touch-manipulation px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {s.name}
              </button>
            ))}
            {matches.length === 0 && (
              <p className="px-3 py-2 text-sm text-zinc-500">No matches</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
