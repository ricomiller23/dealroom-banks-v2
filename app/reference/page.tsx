"use client";
import { useStore, derive, actions } from "@/lib/store";
import { money, pct } from "@/lib/fmt";
import { Card, PageHead, Badge, Btn, Th, Td } from "@/components/ui";

export default function Page() {
  const s = useStore(); const d = derive(s);
  const computed = [["raise.committed", "Committed (computed)", money(d.committed)], ["raise.funded", "Cleared & funded (computed)", money(d.funded)], ["raise.soft", "Soft-circled (computed)", money(d.soft)],
    ["raise.remaining", "Remaining (computed)", money(d.remaining)], ["raise.pct_committed", "% committed (computed)", pct(d.pct)], ["raise.investor_count", "Investors (computed)", String(d.investors)]];
  return (<>
    <PageHead eyebrow="Single Source of Truth" tag="Zero discrepancy by construction" title="Facts & Terms Ratification Engine" sub="Static facts are edited once (Admin → Facts). Computed facts come straight from the ledger, so no page can disagree with another." />
    <Card className={`mb-6 p-5 ${d.openTerms ? "border-amber-300 bg-amber-50" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="font-semibold">{d.openTerms ? `${d.openTerms} open term awaiting ratification` : "All open terms ratified"}</div>
        <Badge tone={d.openTerms ? "amber" : "green"}>{s.facts.length + computed.length} fact nodes</Badge></div>
      {s.facts.filter(f => f.status === "open").map(f => <div key={f.key} className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 text-sm"><span><b>{f.label}:</b> {f.value}</span><Btn onClick={() => actions.setFact(f.key, f.value === "Pending organizer vote" ? "December 31, 2027" : f.value, "confirmed")}>Ratify</Btn></div>)}
    </Card>
    <Card className="overflow-x-auto"><table className="w-full"><thead className="border-b border-border bg-ground"><tr><Th>Key</Th><Th>Label</Th><Th>Live value</Th><Th>Status</Th><Th>Source</Th></tr></thead>
      <tbody className="divide-y divide-border">
        {s.facts.map(f => <tr key={f.key}><Td className="mono text-xs">{f.key}</Td><Td>{f.label}</Td><Td className="font-medium">{f.value}</Td><Td><Badge tone={f.status === "open" ? "amber" : "green"}>{f.status}</Badge></Td><Td className="text-muted">{f.source}</Td></tr>)}
        {computed.map(([k, l, v]) => <tr key={k}><Td className="mono text-xs">{k}</Td><Td>{l}</Td><Td className="font-medium">{v}</Td><Td><Badge tone="blue">computed</Badge></Td><Td className="text-muted">Computed live from the investments ledger</Td></tr>)}
      </tbody></table></Card>
  </>);
}
