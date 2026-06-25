import { CalendarDays, Heart, MapPinned, RadioTower, UserRound } from "lucide-react";
import { ProfileSavedCities } from "@/components/profile-saved-cities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return {
    title: `${username} Profile`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm lg:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-md bg-[#17201d] text-2xl font-black text-white">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-[#008a7a]">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Profile
            </p>
            <h1 className="mt-1 text-4xl font-black text-[#17201d]">
              @{username}
            </h1>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileStat icon={MapPinned} label="Visited Cities" value="8" />
          <ProfileStat icon={Heart} label="Currently Living" value="New York" />
          <ProfileStat icon={RadioTower} label="Experiences Shared" value="4" />
          <ProfileStat icon={CalendarDays} label="Joined Date" value="Jun 2026" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4">
          <SectionTitle title="My Saved Cities" />
          <ProfileSavedCities />
        </div>

        <div className="grid gap-4">
          <SectionTitle title="Contribution Loop" />
          <div className="grid gap-3">
            <div className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase text-[#6d7872]">
                Local Signals Shared
              </p>
              <p className="mt-2 text-3xl font-black text-[#17201d]">2</p>
            </div>
            <div className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase text-[#6d7872]">
                Saved Cities
              </p>
              <p className="mt-2 text-3xl font-black text-[#17201d]">
                Stored locally
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-[#f2f5f0] p-4">
      <Icon className="mb-3 h-5 w-5 text-[#008a7a]" aria-hidden="true" />
      <p className="text-xs font-bold uppercase text-[#6d7872]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#17201d]">{value}</p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-3xl font-black text-[#17201d]">{title}</h2>;
}
