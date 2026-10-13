"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Link2, Scale, Calculator, FileLock2, Wallet, Users, FolderArchive, Route } from "lucide-react";
import { useStore, derive } from "@/lib/store";
import { money, pct } from "@/lib/fmt";
import { Card, Stat, Badge, Bar, Btn } from "@/components/ui";
import manifest from "@/public/docs/manifest.json";

const PILLARS = [
  { i: Wallet, t: "Living Wire Ledger", d: "Commitments, soft circles and cleared wires roll up to one number everywhere." },
  { i: ShieldCheck, t: "Rule 506(c) Gate", d: "Offering documents stay locked until an investor's accreditation is verified." },
  { i: Link2, t: "Tracked Packages", d: "A 32-character link per investor, watermarked, with open and view telemetry." },
  { i: Scale, t: "Single Source of Truth", d: "Edit a term once in the Fact Engine; every page and the calculator follow." },
  { i: Calculator, t: "Dilution Modeling", d: "Shares, ownership, 10% change-in-control check and day-one book value dilution." },
  { i: FileLock2, t: "Hash-Verified Vault", d: "Every file carries a real SHA-256 you can verify in your browser." },
];

export default function Overview() {
  const s = useStore(); const d = derive(s); const p = s.profile;
  return (
    <>
      <section className="rounded-3xl bg-rail p-8 text-white">
        <div className="flex flex-wrap gap-2"><Badge tone="blue">Interactive Sandbox</Badge><Badge tone="green">Live Operating Environment</Badge></div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{p.name}<span className="block text-xl font-normal text-slate-300">{p.instrument} Offering · {money(p.target)} · {p.city}, {p.state}</span></h1>
        <p className="mt-3 max-w-2xl text-slate-300">The deal room de novo and growth-stage banks can use to run an internal capital raise: investor CRM, pipeline, ledger, gated data room and tracked packages in one place.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/raise"><Btn>Test Dilution Calculator <ArrowRight size={14} /></Btn></Link><Link href="/admin"><Btn variant="ghost">Open Investor CRM</Btn></Link></div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Committed" value={money(d.committed)} sub={`${pct(d.pct)} of ${money(d.target)}`} tone="blue" />
        <Stat label="Cleared in escrow" value={money(d.funded)} sub="Wires confirmed" tone="green" />
        <Stat label="Soft-circled" value={money(d.soft)} sub="Not yet documented" tone="amber" />
        <Stat label="Escrow minimum" value={pct(d.escrowPct, 0)} sub={`${money(d.committed)} of ${money(p.minEscrow)} to break escrow`} />
      </div>

      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{p.instrument} tranche</h2><Badge tone="blue">{pct(d.pct)} allocated</Badge></div>
        <div className="mt-3"><Bar value={d.pct} /></div>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
          <div><div className="text-muted">Remaining</div><div className="mono font-semibold">{money(d.remaining)}</div></div>
          <div><div className="text-muted">Price / share</div><div className="mono font-semibold">${p.price.toFixed(2)}</div></div>
          <div><div className="text-muted">Investors</div><div className="mono font-semibold">{d.investors}</div></div>
          <div><div className="text-muted">Closing window</div><div className="font-semibold">{p.closing}</div></div>
        </div>
        {d.cic.length > 0 && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">⚠ {d.cic.length} investor(s) at or near 10% of voting shares — change-in-control review may be required. See Admin → Contacts.</div>}
      </Card>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Six core pillars</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(x => { const I = x.i; return <Card key={x.t} className="p-5"><I className="text-brand" size={20} /><div className="mt-3 font-semibold">{x.t}</div><p className="mt-1 text-sm text-muted">{x.d}</p></Card>; })}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[{ h: "/admin", i: Users, t: "Investor CRM", d: "Contacts, accreditation status, 10% flags, check sizes." }, { h: "/documents", i: FolderArchive, t: "Documents Vault", d: `${manifest.length} sample documents with verifiable hashes.` }, { h: "/roadmap", i: Route, t: "Charter Roadmap", d: "From pre-filing to opening day, with what to track at each stage." }].map(c => {
          const I = c.i; return <Link key={c.h} href={c.h}><Card className="h-full p-5 transition hover:shadow-md"><I className="text-brand" size={20} /><div className="mt-3 font-semibold">{c.t}</div><p className="mt-1 text-sm text-muted">{c.d}</p></Card></Link>; })}
      </div>

      <div className="mb-3 mt-10 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent diligence artifacts</h2><Link href="/documents" className="text-sm text-brand">View all ({manifest.length}) →</Link></div>
      <Card className="divide-y divide-border">
        {manifest.slice(0, 5).map(m => (
          <Link key={m.code} href={`/documents/${m.code}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-ground">
            <div><span className="mono mr-3 text-xs text-muted">{m.code}</span><span className="text-sm font-medium">{m.title}</span></div><Badge>{m.category}</Badge></Link>))}
      </Card>
    </>
  );
}
