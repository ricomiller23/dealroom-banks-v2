export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const num = (n: number) => Math.round(n).toLocaleString("en-US");
export const pct = (n: number, d = 1) => (isFinite(n) ? n.toFixed(d) : "0.0") + "%";
export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(" ");
export const when = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }) + " UTC";
export const uid = (p = "id") => p + "-" + Math.random().toString(36).slice(2, 10);
export const token32 = () => Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");
