import Link from "next/link";
import { GitCompare, MapPinned, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d7ded4] bg-[#f7f8f3]/92 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#008a7a] text-lg font-black text-white">
            L
          </span>
          <span className="text-lg font-black text-[#17201d]">LandingPoint</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/recommendations">
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Explore</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/compare">
              <GitCompare className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Compare</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/profile/demo">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
