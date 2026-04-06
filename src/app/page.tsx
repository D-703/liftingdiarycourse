import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/image_52edbc1e.png"
          alt="Apex Fit Logo"
          width={400}
          height={225}
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Workout Recorder App
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          your one stop shop to record and analyse workouts
        </p>
        <div className="flex gap-4 mt-2">
          <SignInButton forceRedirectUrl="/dashboard">
            <button className="px-6 py-2 rounded-lg border border-zinc-300 text-zinc-800 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </main>
    </div>
  );
}
