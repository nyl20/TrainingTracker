import Link from "next/link";
import { signIn } from "@/app/auth/actions";

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Sign in
        </h1>

        {message && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-500">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        )}

        <form action={signIn} className="mt-6 flex flex-col gap-2">
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
            className={inputClass}
          />
          <button type="submit" className={buttonClass}>
            Sign in
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
