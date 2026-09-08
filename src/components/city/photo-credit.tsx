import type { CityHeroImage } from "@/lib/data";

export function PhotoCredit({ photo }: { photo: CityHeroImage }) {
  return <p className="px-3 py-2 text-[10px] leading-4 text-[var(--muted)] bg-white">
    Photo: <a className="underline underline-offset-2 hover:text-[var(--accent)]" href={photo.sourcePageUrl} target="_blank" rel="noopener noreferrer" title={photo.title}>{photo.creator}</a>
    {" · "}<a className="underline underline-offset-2" href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a>
    {" · Cropped to fit"}
  </p>;
}
