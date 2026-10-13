"use client";
import Link from "next/link";
import { useStore, derive } from "@/lib/store";
import { money, pct } from "@/lib/fmt";
import { Card, PageHead, Btn, Badge } from "@/components/ui";
export default function Page() {
  const s = useStore(); const d = derive(s); const p = s.profile;
  return (<>
    <PageHead eyebrow="Executive Briefing" tag="Live from the Fact Engine" title={`${p.name} Executive Summary`} action={<Link href="/raise"><Btn>View Terms</Btn></Link>} />
    <div className="grid gap-4 md:grid-cols-3">
      {[["The gap", "Community businesses in the service area want a locally owned bank; large institutions are consolidating branches."], ["The opportunity", "Owner-operated firms need a relationship lender and a depository that decides locally."], ["The urgency", "Organizers must close the capital raise inside the approval window or restart the clock."]].map(([t, x]) =>
        <Card key={t} className="p-5"><div className="text-xs font-bold uppercase tracking-wide text-brand">{t}</div><p className="mt-2 text-sm">{x}</p></Card>)}
    </div>
    <Card className="mt-6 p-6"><h2 className="font-semibold">Strategy</h2>
      <p className="mt-2 text-sm text-muted">{p.name} will pursue relationship-driven business banking — SBA 7(a), owner-occupied commercial real estate and operating-account deposits — with local decision-making and a technology stack that keeps overhead low. Illustrative projections: breakeven in month 22, $210M in assets by year three.</p></Card>
    <Card className="mt-6 p-6"><h2 className="font-semibold">Capital formation</h2>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
        <div><dt className="text-muted">Target raise</dt><dd className="mono font-semibold">{money(p.target)}</dd></div>
        <div><dt className="text-muted">Security</dt><dd className="font-semibold">{p.instrument}</dd></div>
        <div><dt className="text-muted">Price / share</dt><dd className="mono font-semibold">${p.price.toFixed(2)}</dd></div>
        <div><dt className="text-muted">Status</dt><dd className="font-semibold">{money(d.committed)} committed ({pct(d.pct)})</dd></div>
      </dl>
      <div className="mt-4 flex gap-2"><Link href="/raise"><Btn>Open Living Wire Ledger & Dilution Calculator</Btn></Link><Badge tone="amber">Sample data</Badge></div></Card>
  </>);
}
