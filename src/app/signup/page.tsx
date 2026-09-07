import Link from "next/link";
import { signUp } from "@/app/auth/actions";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Sign up as a coach
        </h1>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        )}

        <form action={signUp} className="mt-6 flex flex-col gap-2">
          <input name="name" placeholder="Your name" required className={inputClass} />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className={inputClass}
          />
          <label className="text-sm text-zinc-500">
            Clubs you coach at (comma-separated)
            <input
              name="clubs"
              placeholder="Riverside Archery Club, Downtown Club"
              required
              className={`mt-1 w-full ${inputClass}`}
            />
          </label>
          <button type="submit" className={buttonClass}>
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
