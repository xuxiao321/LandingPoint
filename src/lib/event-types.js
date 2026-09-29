export function isUpcoming(event, today) {
  return event.startDate >= today;
}
export function safeEventUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
