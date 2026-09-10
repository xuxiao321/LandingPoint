import Link from "next/link";
import { GitCompare, MapPinned, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="brand-mark flex items-center gap-3" aria-label="LandingPoint home">
          <span className="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none"><path d="M20 4.5c-6.8 0-12.2 5.4-12.2 12.1 0 8.6 12.2 18.7 12.2 18.7s12.2-10.1 12.2-18.7C32.2 9.9 26.8 4.5 20 4.5Z" fill="currentColor"/><circle cx="20" cy="16.7" r="4.7" fill="white"/><path d="m20 24.5 3.4 6.2-3.4-1.7-3.4 1.7 3.4-6.2Z" fill="white" opacity=".9"/></svg>
          </span>
          <span className="brand-word"><span>landing</span><b>point</b></span>
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
            <Link href="/account">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
