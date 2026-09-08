export type SavedPreferences = {
  budget: number;
  passport: string;
  workType: string;
  needsSponsorship: string;
  lifestyles: string[];
  priorities?: Record<string, number>;
};
export type AccountData = {
  email: string;
  joinedAt: string;
  savedCities: string[];
  preferences: SavedPreferences | null;
  drafts: { city_slug: string; kind: string; content: Record<string, string>; updated_at: string }[];
};
