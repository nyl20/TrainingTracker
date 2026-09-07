"use client";

import { deleteStudent } from "@/app/actions";

export default function DeleteStudentButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  return (
    <form
      action={deleteStudent}
      onSubmit={(e) => {
        const confirmed = window.confirm(
          `Delete ${studentName}? This will also permanently delete all of their progress logs. This cannot be undone.`,
        );
        if (!confirmed) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="studentId" value={studentId} />
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
      >
        Delete student
      </button>
    </form>
  );
}
