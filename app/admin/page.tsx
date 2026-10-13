"use client";
import Link from "next/link";
import { useStore, derive, STAGES } from "@/lib/store";
import { money, pct, when } from "@/lib/fmt";
import { Card, Stat, PageHead, Btn, Badge } from "@/components/ui";
export default function Page() {
  const s = useStore(); const d = derive(s);
  const mods = [["/admin/pipeline", "Pipeline Kanban", "Drag-and-drop stages"], ["/admin/contacts", "Investor CRM", "Contacts, accreditation, 10% flags"], ["/admin/investments", "Investments Ledger", "Record wires & terms"], ["/admin/facts", "Source of Truth Editor", "Edit live facts & terms"], ["/admin/packages", "Tracked Packages", "Generate links & logs"], ["/admin/activity", "Activity Log", "Every change and access event"]];
  return (<>
    <PageHead eyebrow="Management Console" title="Admin CRM & Deal Room Hub" sub="Real-time pipeline tracking, investment ledger, document versioning and diligence telemetry." action={<div className="flex gap-2"><Link href="/admin/contacts"><Btn variant="ghost">Add Contact</Btn></Link><Link href="/admin/packages"><Btn>Send Package</Btn></Link></div>} />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Committed capital" value={money(d.committed)} sub={`${pct(d.pct)} of ${money(d.target)}`} tone="blue" />
      <Stat label="Cleared & funded" value={money(d.funded)} sub="Wires confirmed" tone="green" />
      <Stat label="CRM contacts" value={String(s.contacts.length)} sub={`${d.investors} with commitments`} />
      <Stat label="Open terms" value={String(d.openTerms)} sub={d.openTerms ? "Awaiting ratification" : "All ratified"} tone={d.openTerms ? "amber" : undefined} />
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mods.map(([h, t, x]) => <Link key={h} href={h}><Card className="p-5 transition hover:shadow-md"><div className="font-semibold">{t}</div><div className="text-sm text-muted">{x}</div></Card></Link>)}</div>
    <Card className="mt-6 p-6"><div className="flex justify-between"><h2 className="font-semibold">Pipeline funnel</h2><Link className="text-sm text-brand" href="/admin/pipeline">View full board →</Link></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{STAGES.map(st => <div key={st.k} className="rounded-xl bg-ground p-3"><div className="text-xs text-muted">{st.l}</div><div className="mono text-xl font-semibold">{s.contacts.filter(c => c.stage === st.k).length}</div></div>)}</div></Card>
    {d.cic.length > 0 && <Card className="mt-6 border-amber-300 bg-amber-50 p-5 text-sm"><b>Change-in-control watch:</b> {d.cic.map(x => `${s.contacts.find(c => c.id === x.id)?.name} (${pct(x.pct)})`).join(", ")}</Card>}
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="p-6"><div className="flex justify-between"><h2 className="font-semibold">Recent CRM activity</h2><Link className="text-sm text-brand" href="/admin/activity">All logs →</Link></div>
        <ul className="mt-3 space-y-2 text-sm">{s.activity.slice(0, 6).map(a => <li key={a.id}>{a.text} <span className="text-xs text-muted">· {a.type} · {when(a.ts)}</span></li>)}{s.activity.length === 0 && <li className="text-muted">Nothing yet.</li>}</ul></Card>
      <Card className="p-6"><h2 className="font-semibold">Access events & telemetry</h2>
        <ul className="mono mt-3 space-y-2 text-xs">{s.events.slice(0, 6).map(e => <li key={e.id}><Badge tone="blue">{e.event}</Badge> {e.detail} <span className="text-muted">· {when(e.ts)}</span></li>)}{s.events.length === 0 && <li className="text-muted">No access events yet.</li>}</ul></Card>
    </div>
  </>);
}
