import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-3xl place-items-center px-4 py-12 text-center">
      <div>
        <p className="text-sm font-black uppercase text-[#008a7a]">
          City not found
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#17201d]">
          This city is not in the MVP index yet.
        </h1>
        <Button asChild className="mt-6">
          <Link href="/recommendations">Back to Top Matches</Link>
        </Button>
      </div>
    </main>
  );
}
