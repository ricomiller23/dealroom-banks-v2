"use client";
import { useSyncExternalStore } from "react";
import { uid } from "./fmt";

export const STAGES = [
  { k: "lead", l: "Lead" },
  { k: "contacted", l: "Contacted" },
  { k: "package_sent", l: "Package Sent" },
  { k: "opened", l: "Opened" },
  { k: "meeting", l: "Meeting" },
  { k: "diligence", l: "Diligence" },
  { k: "soft_circled", l: "Soft-Circled" },
  { k: "committed", l: "Committed" },
  { k: "funded", l: "Funded" },
  { k: "passed", l: "Passed" },
] as const;
export type StageKey = (typeof STAGES)[number]["k"];
export type Accred = "verified" | "pending" | "not_started" | "failed";
export type InvStatus = "soft" | "committed" | "funded";

export interface Profile {
  name: string; holdco: string; city: string; state: string; charter: string; instrument: string;
  target: number; price: number; minEscrow: number; minCheck: number; costPct: number; closing: string;
  exemption: string; counsel: string; ceo: string; cfo: string; email: string;
}
export interface Contact {
  id: string; name: string; firm: string; type: string; city: string; email: string; phone: string;
  target: number; accred: Accred; stage: StageKey; notes: string; lastTouch: string; source: string;
}
export interface Investment { id: string; contactId: string; amount: number; status: InvStatus; wireRef: string; date: string; }
export interface Fact { key: string; label: string; value: string; status: "confirmed" | "open"; source: string; computed?: boolean; }
export interface Pkg { id: string; token: string; contactId: string; docs: string[]; created: string; expires: string; opens: number; lastOpen?: string; }
export interface Activity { id: string; type: string; text: string; ts: string; }
export interface Evt { id: string; event: string; detail: string; ts: string; actor: string; }
export interface State {
  v: number; profile: Profile; contacts: Contact[]; investments: Investment[]; facts: Fact[]; packages: Pkg[];
  activity: Activity[]; events: Evt[]; factHistory: { key: string; old: string; next: string; ts: string }[];
}

export const DOC_PRESETS: Record<string, { label: string; docs: string[] }> = {
  intro: { label: "Investor Intro", docs: ["D-01", "D-02", "D-04"] },
  financial: { label: "Financial Diligence", docs: ["D-02", "D-03", "D-06", "D-09"] },
  offering: { label: "Offering Documents (506(c) gated)", docs: ["D-01", "D-07", "D-08", "D-10", "D-11"] },
  full: { label: "Full Data Room", docs: ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06", "D-07", "D-08", "D-09", "D-10", "D-11"] },
};
export const GATED_DOCS = ["D-07", "D-08", "D-10"];

const BASE = Date.parse("2026-10-12T17:00:00Z");
const iso = (daysAgo: number) => new Date(BASE - daysAgo * 86400000).toISOString();

export function seed(): State {
  const c = (id: string, name: string, firm: string, type: string, city: string, email: string, target: number, accred: Accred, stage: StageKey, notes: string, days: number): Contact => ({
    id, name, firm, type, city, email, phone: "", target, accred, stage, notes, lastTouch: iso(days), source: "Sample data",
  });
  return {
    v: 3,
    profile: {
      name: "Larkspur Community Bank", holdco: "Larkspur Bancorp, Inc.", city: "Mesa", state: "AZ", charter: "Arizona state-chartered commercial bank (in organization)",
      instrument: "Common Stock", target: 25_000_000, price: 10, minEscrow: 20_000_000, minCheck: 25_000, costPct: 5,
      closing: "Q1 – Q2 2027", exemption: "Rule 506(c) — verified accredited investors", counsel: "Sample Counsel LLP (fictional)",
      ceo: "Marisol Reyes", cfo: "Daniel Okafor", email: "organizers@larkspurbank.example",
    },
    contacts: [
      c("c-001", "Harlan Pryce", "Harlan & Pryce Capital", "Institution", "Scottsdale, AZ", "hp@example.com", 3_000_000, "verified", "committed", "Wants board observer seat. Over 10% — change-in-control review needed.", 3),
      c("c-002", "Dr. Anita Rao", "Rao Family Office", "Family Office", "Chandler, AZ", "anita@example.com", 500_000, "verified", "funded", "Anchor check cleared escrow.", 6),
      c("c-003", "Luis Ortega", "Mesa Valley Builders LLC", "Business Owner", "Mesa, AZ", "luis@example.com", 750_000, "verified", "funded", "Also a deposit and SBA prospect.", 9),
      c("c-004", "Jean Thompson", "Thompson Ag Holdings", "Business Owner", "Gilbert, AZ", "jean@example.com", 1_000_000, "verified", "committed", "Docs signed; wire expected next week.", 2),
      c("c-005", "Ridgeline Partners", "Ridgeline Family Office", "Family Office", "Phoenix, AZ", "team@example.com", 2_000_000, "verified", "funded", "Lead organizer investor.", 14),
      c("c-006", "Sam Whitfield", "Whitfield Dental Group", "Business Owner", "Tempe, AZ", "sam@example.com", 250_000, "pending", "soft_circled", "Accreditation letter requested from CPA.", 1),
      c("c-007", "Elena Marquez", "Marquez Insurance Agency", "Business Owner", "Mesa, AZ", "elena@example.com", 150_000, "not_started", "meeting", "Coffee set for Thursday.", 1),
      c("c-008", "Casey Doyle", "Individual", "Individual", "Queen Creek, AZ", "casey@example.com", 100_000, "not_started", "package_sent", "Unverified — offering docs are blocked by the 506(c) gate.", 4),
      c("c-009", "Priya Shah", "Shah Medical Partners", "Business Owner", "Chandler, AZ", "priya@example.com", 300_000, "pending", "opened", "Opened package twice.", 2),
      c("c-010", "Desert Sky Foundation", "Desert Sky Foundation", "Institution", "Phoenix, AZ", "grants@example.com", 500_000, "not_started", "lead", "Intro via board member.", 5),
    ],
    investments: [
      { id: "i-1", contactId: "c-005", amount: 2_000_000, status: "funded", wireRef: "WR-20260921-001", date: iso(14) },
      { id: "i-2", contactId: "c-003", amount: 750_000, status: "funded", wireRef: "WR-20261004-002", date: iso(9) },
      { id: "i-3", contactId: "c-002", amount: 500_000, status: "funded", wireRef: "WR-20261007-003", date: iso(6) },
      { id: "i-4", contactId: "c-001", amount: 3_000_000, status: "committed", wireRef: "", date: iso(3) },
      { id: "i-5", contactId: "c-004", amount: 1_000_000, status: "committed", wireRef: "", date: iso(2) },
      { id: "i-6", contactId: "c-006", amount: 250_000, status: "soft", wireRef: "", date: iso(1) },
    ],
    facts: [
      { key: "bank.name", label: "Bank name", value: "Larkspur Community Bank", status: "confirmed", source: "Organizer resolution" },
      { key: "bank.holdco", label: "Holding company", value: "Larkspur Bancorp, Inc.", status: "confirmed", source: "Articles of incorporation" },
      { key: "bank.charter", label: "Charter type", value: "Arizona state-chartered commercial bank (in organization)", status: "confirmed", source: "Charter application" },
      { key: "raise.instrument", label: "Security offered", value: "Common Stock", status: "confirmed", source: "Offering summary D-01" },
      { key: "raise.exemption", label: "Securities exemption", value: "Rule 506(c) — verified accredited investors", status: "confirmed", source: "Counsel memo" },
      { key: "raise.target", label: "Target raise (USD)", value: "25000000", status: "confirmed", source: "Business plan" },
      { key: "raise.price", label: "Price per share (USD)", value: "10", status: "confirmed", source: "Offering summary D-01" },
      { key: "raise.min_escrow", label: "Escrow minimum (USD)", value: "20000000", status: "confirmed", source: "Escrow agreement D-08" },
      { key: "raise.min_check", label: "Minimum subscription (USD)", value: "25000", status: "confirmed", source: "Offering summary D-01" },
      { key: "raise.cost_pct", label: "Offering costs (% of gross)", value: "5", status: "confirmed", source: "Pro forma D-03" },
      { key: "raise.closing", label: "Closing window", value: "Q1 – Q2 2027", status: "confirmed", source: "Roadmap" },
      { key: "raise.escrow_outside_date", label: "Escrow outside date", value: "Pending organizer vote", status: "open", source: "Open item — needs board ratification" },
    ],
    packages: [
      { id: "p-demo", token: "demo-investor", contactId: "c-009", docs: DOC_PRESETS.intro.docs, created: iso(2), expires: "2036-12-31T00:00:00.000Z", opens: 2, lastOpen: iso(1) },
    ],
    activity: [
      { id: "a-1", type: "investment", text: "Recorded $3,000,000 commitment from Harlan & Pryce Capital", ts: iso(3) },
      { id: "a-2", type: "investment", text: "Funded $500,000 anchor check from Rao Family Office", ts: iso(6) },
      { id: "a-3", type: "package", text: "Dispatched Investor Intro package to Priya Shah", ts: iso(2) },
    ],
    events: [
      { id: "e-1", event: "open", detail: "/p/demo-investor", ts: iso(2), actor: "ip:a3f1c9…" },
      { id: "e-2", event: "view_doc", detail: "D-01", ts: iso(2), actor: "ip:a3f1c9…" },
    ],
    factHistory: [],
  };
}

const KEY = "dealroom-bank-demo-v3";
let state: State = seed();
const SERVER = state;
const subs = new Set<() => void>();
let loaded = false;

function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function emit() { subs.forEach(f => f()); }
function load() {
  if (loaded) return; loaded = true;
  try {
    const s = localStorage.getItem(KEY);
    if (s) { const p = JSON.parse(s); if (p && p.v === 3) { state = p; emit(); } }
  } catch {}
}
function subscribe(f: () => void) { subs.add(f); load(); return () => { subs.delete(f); }; }
export function useStore(): State { return useSyncExternalStore(subscribe, () => state, () => SERVER); }

function set(fn: (s: State) => State) { state = fn(state); persist(); emit(); }
const log = (s: State, type: string, text: string): State => ({ ...s, activity: [{ id: uid("a"), type, text, ts: new Date().toISOString() }, ...s.activity].slice(0, 200) });

export const actions = {
  reset() { state = seed(); persist(); emit(); },
  blank(p: Partial<Profile>) {
    const base = seed();
    state = { ...base, profile: { ...base.profile, ...p }, contacts: [], investments: [], packages: [], activity: [], events: [],
      facts: base.facts.map(f => f.key === "bank.name" ? { ...f, value: p.name ?? f.value } : f.key === "raise.target" ? { ...f, value: String(p.target ?? base.profile.target) } : f.key === "raise.price" ? { ...f, value: String(p.price ?? base.profile.price) } : f.key === "bank.holdco" ? { ...f, value: p.holdco ?? f.value } : f) };
    persist(); emit();
  },
  addContact(c: Omit<Contact, "id" | "lastTouch" | "source"> & { source?: string }) {
    const n: Contact = { ...c, id: uid("c"), lastTouch: new Date().toISOString(), source: c.source || "Manual" };
    set(s => log({ ...s, contacts: [n, ...s.contacts] }, "contact", `Added contact ${n.name}`));
    return n;
  },
  updateContact(id: string, patch: Partial<Contact>) { set(s => ({ ...s, contacts: s.contacts.map(c => c.id === id ? { ...c, ...patch, lastTouch: new Date().toISOString() } : c) })); },
  deleteContact(id: string) { set(s => ({ ...s, contacts: s.contacts.filter(c => c.id !== id), investments: s.investments.filter(i => i.contactId !== id) })); },
  moveStage(id: string, stage: StageKey) {
    set(s => { const c = s.contacts.find(x => x.id === id); if (!c || c.stage === stage) return s;
      return log({ ...s, contacts: s.contacts.map(x => x.id === id ? { ...x, stage, lastTouch: new Date().toISOString() } : x) }, "pipeline", `${c.name} moved to ${STAGES.find(x => x.k === stage)?.l}`); });
  },
  addInvestment(i: Omit<Investment, "id" | "date"> & { date?: string }) {
    set(s => { const c = s.contacts.find(x => x.id === i.contactId);
      const inv: Investment = { ...i, id: uid("i"), date: i.date || new Date().toISOString() };
      const stage: StageKey = i.status === "funded" ? "funded" : i.status === "committed" ? "committed" : "soft_circled";
      const order = STAGES.map(x => x.k);
      return log({ ...s, investments: [inv, ...s.investments],
        contacts: s.contacts.map(x => x.id === i.contactId && order.indexOf(x.stage) < order.indexOf(stage) ? { ...x, stage } : x) },
        "investment", `Recorded $${i.amount.toLocaleString("en-US")} ${i.status} from ${c?.name ?? "investor"}`); });
  },
  updateInvestment(id: string, patch: Partial<Investment>) { set(s => ({ ...s, investments: s.investments.map(i => i.id === id ? { ...i, ...patch } : i) })); },
  deleteInvestment(id: string) { set(s => ({ ...s, investments: s.investments.filter(i => i.id !== id) })); },
  setFact(key: string, value: string, status?: "confirmed" | "open") {
    set(s => { const f = s.facts.find(x => x.key === key); if (!f) return s;
      const facts = s.facts.map(x => x.key === key ? { ...x, value, status: status ?? x.status } : x);
      const num = (k: string, d: number) => Number(facts.find(x => x.key === k)?.value) || d;
      const profile = { ...s.profile, name: facts.find(x => x.key === "bank.name")?.value ?? s.profile.name, holdco: facts.find(x => x.key === "bank.holdco")?.value ?? s.profile.holdco,
        target: num("raise.target", s.profile.target), price: num("raise.price", s.profile.price), minEscrow: num("raise.min_escrow", s.profile.minEscrow),
        minCheck: num("raise.min_check", s.profile.minCheck), costPct: num("raise.cost_pct", s.profile.costPct), closing: facts.find(x => x.key === "raise.closing")?.value ?? s.profile.closing };
      return log({ ...s, facts, profile, factHistory: [{ key, old: f.value, next: value, ts: new Date().toISOString() }, ...s.factHistory] }, "fact", `Updated fact ${key}`); });
  },
  createPackage(contactId: string, docs: string[], days: number, label: string) {
    const t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");
    const p: Pkg = { id: uid("p"), token: t, contactId, docs, created: new Date().toISOString(), expires: new Date(Date.now() + days * 86400000).toISOString(), opens: 0 };
    set(s => { const c = s.contacts.find(x => x.id === contactId);
      const order = STAGES.map(x => x.k);
      return log({ ...s, packages: [p, ...s.packages],
        contacts: s.contacts.map(x => x.id === contactId && order.indexOf(x.stage) < order.indexOf("package_sent") ? { ...x, stage: "package_sent" as StageKey } : x) },
        "package", `Dispatched ${label} package to ${c?.name ?? "contact"}`); });
    return p;
  },
  recordOpen(token: string, detail: string, kind: "open" | "view_doc" | "gate_pass" | "gate_block") {
    set(s => { const p = s.packages.find(x => x.token === token); if (!p) return s;
      const c = s.contacts.find(x => x.id === p.contactId);
      const order = STAGES.map(x => x.k);
      return { ...s,
        packages: kind === "open" ? s.packages.map(x => x.token === token ? { ...x, opens: x.opens + 1, lastOpen: new Date().toISOString() } : x) : s.packages,
        contacts: kind === "open" ? s.contacts.map(x => x.id === p.contactId && order.indexOf(x.stage) < order.indexOf("opened") ? { ...x, stage: "opened" as StageKey } : x) : s.contacts,
        events: [{ id: uid("e"), event: kind, detail, ts: new Date().toISOString(), actor: c?.email ?? "visitor" }, ...s.events].slice(0, 300) }; });
  },
  setAccred(id: string, a: Accred) { set(s => log({ ...s, contacts: s.contacts.map(c => c.id === id ? { ...c, accred: a } : c) }, "compliance", `Accreditation set to ${a} for ${s.contacts.find(c => c.id === id)?.name}`)); },
};

export function derive(s: State) {
  const sum = (f: (i: Investment) => boolean) => s.investments.filter(f).reduce((a, i) => a + i.amount, 0);
  const funded = sum(i => i.status === "funded");
  const committed = sum(i => i.status === "committed" || i.status === "funded");
  const soft = sum(i => i.status === "soft");
  const target = s.profile.target;
  const sharesSold = committed / s.profile.price;
  const sharesTarget = target / s.profile.price;
  const byContact = new Map<string, number>();
  s.investments.forEach(i => byContact.set(i.contactId, (byContact.get(i.contactId) ?? 0) + i.amount));
  const cic = [...byContact.entries()].filter(([, a]) => a / s.profile.price / sharesTarget >= 0.099).map(([id, a]) => ({ id, amount: a, pct: (a / s.profile.price / sharesTarget) * 100 }));
  return { funded, committed, soft, target, pct: target ? (committed / target) * 100 : 0, remaining: Math.max(0, target - committed), sharesSold, sharesTarget,
    investors: new Set(s.investments.filter(i => i.status !== "soft").map(i => i.contactId)).size, escrowPct: s.profile.minEscrow ? (committed / s.profile.minEscrow) * 100 : 0,
    cic, openTerms: s.facts.filter(f => f.status === "open").length };
}
