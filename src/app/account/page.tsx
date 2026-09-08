import { AccountPanel } from "@/components/account-panel";
export const metadata = { title: "Your account", robots: { index: false, follow: false } };
export default function AccountPage() { return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><AccountPanel /></main>; }
