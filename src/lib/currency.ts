// Local units per USD. Cached ExchangeRate-API observation; not a live quote.
export const exchangeRateDate = "2026-09-07";
const rates: Record<string, number> = {
  AED: 3.6725, AUD: 1.387683, BRL: 5.122069, CAD: 1.383078,
  EUR: 0.861072, GBP: 0.739722, JPY: 156.177011, KRW: 1346.56492,
  MXN: 16.889408, SGD: 1.267101,
};

export function approximateUsd(value: string): string | null {
  const match = value.match(/^([A-Z]{3})\s+([\d,.]+)(?:[–-]([\d,.]+))?(\+)?(\s*\/\s*m²)?$/);
  if (!match || !rates[match[1]]) return null;
  const format = (amount: string) => {
    const number = Number(amount.replaceAll(",", "")) / rates[match[1]];
    return number.toLocaleString("en-US", {
      minimumFractionDigits: match[5] ? 2 : 0,
      maximumFractionDigits: match[5] ? 2 : 0,
    });
  };
  return `≈ US$${format(match[2])}${match[3] ? `–${format(match[3])}` : ""}${match[4] ?? ""}${match[5] ?? ""}`;
}
