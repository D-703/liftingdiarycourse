import Image from "next/image"
import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <Image
            src="/image_52edbc1e.png"
            alt="Apex Fit Logo"
            width={100}
            height={56}
            className="object-contain"
          />
          <UserButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
