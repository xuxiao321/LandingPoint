export function isUpcoming(event, today) {
  // Dates are ISO calendar dates, so lexical comparison is timezone-safe.
  return event.startDate >= today;
}
export function safeEventUrl(value) {
  try {
    const url = new URL(value);
    // External links must not carry credentials or use executable URL schemes.
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
