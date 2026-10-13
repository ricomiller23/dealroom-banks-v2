"use client";
import { useState } from "react";
import { useStore, derive } from "@/lib/store";
import { money, pct, num } from "@/lib/fmt";
import { Card, PageHead, Stat, Badge, Bar, Th, Td, inputCls } from "@/components/ui";

export default function Page() {
  const s = useStore(); const d = derive(s); const p = s.profile;
  const [amt, setAmt] = useState(100000);
  const shares = amt / p.price;
  const ownTarget = (shares / d.sharesTarget) * 100;
  const sold = Math.max(d.sharesSold, 0) + shares;
  const ownNow = (shares / sold) * 100;
  const netBV = p.price * (1 - p.costPct / 100);
  const warn = ownTarget >= 9.9, tooSmall = amt < p.minCheck;
  const uses = [["Capital contribution to the Bank (Tier 1)", 85], ["Holding-company liquidity", 10], ["Organizational & offering costs", 5]] as const;
  const rows = s.investments.map(i => ({ i, c: s.contacts.find(c => c.id === i.contactId) }));
  return (<>
    <PageHead eyebrow="Capital Formation" tag="Terms · Ledger · Dilution" title={`${p.name} — ${p.instrument} Offering`} sub="Every figure on this page reads from the ledger and the Fact Engine. Change a term in Admin → Facts and it updates here." />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Target raise" value={money(p.target)} sub={`${num(d.sharesTarget)} shares @ $${p.price.toFixed(2)}`} />
      <Stat label="Committed" value={money(d.committed)} sub={`${pct(d.pct)} allocated`} tone="blue" />
      <Stat label="Cleared in escrow" value={money(d.funded)} tone="green" />
      <Stat label="Soft-circled" value={money(d.soft)} sub="Docs not yet out" tone="amber" />
    </div>
    <Card className="mt-4 p-5"><div className="flex justify-between text-sm"><span>Progress to escrow minimum ({money(p.minEscrow)})</span><span className="mono">{pct(d.escrowPct, 0)}</span></div><div className="mt-2"><Bar value={d.escrowPct} tone="bg-emerald-500" /></div></Card>

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="font-semibold">Stock dilution calculator</h2>
        <div className="mt-3 flex flex-wrap gap-2">{[25000, 50000, 100000, 250000, 500000, 1000000].map(v => <button key={v} onClick={() => setAmt(v)} className={`rounded-full border px-3 py-1 text-sm ${amt === v ? "border-brand bg-blue-50 text-brand" : "border-border"}`}>{money(v)}</button>)}</div>
        <label className="mt-3 block text-sm"><span className="mb-1 block font-medium">Custom amount (USD)</span>
          <input className={inputCls} inputMode="numeric" value={amt} onChange={e => setAmt(Number(e.target.value.replace(/\D/g, "")) || 0)} /></label>
        <dl className="mt-4 divide-y divide-border text-sm">
          {[["Shares purchased", num(shares)], ["Ownership if fully subscribed", pct(ownTarget, 2)], ["Ownership of shares sold today", pct(ownNow, 2)],
            ["Book value / share after offering costs", `$${netBV.toFixed(2)}`], ["Day-one book value dilution / share", `$${(p.price - netBV).toFixed(2)}`]].map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted">{k}</dt><dd className="mono font-semibold">{v}</dd></div>)}
        </dl>
        {warn && <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">⚠ At about 10% or more of voting shares, a change-in-control notice or application may be required. Confirm with counsel.</div>}
        {tooSmall && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">Below the {money(p.minCheck)} minimum subscription.</div>}
        <p className="mt-3 text-xs text-muted">Illustrative arithmetic only. Not an offer or investment advice.</p>
      </Card>
      <Card className="p-6">
        <h2 className="font-semibold">Use of proceeds ({money(p.target)})</h2>
        <div className="mt-4 space-y-4">{uses.map(([k, v]) => <div key={k}><div className="flex justify-between text-sm"><span>{k}</span><span className="mono">{money(p.target * v / 100)} · {v}%</span></div><div className="mt-1"><Bar value={v} /></div></div>)}</div>
        <h2 className="mt-8 font-semibold">Key terms</h2>
        <dl className="mt-2 divide-y divide-border text-sm">{[["Security", p.instrument], ["Exemption", p.exemption], ["Minimum subscription", money(p.minCheck)], ["Escrow minimum", money(p.minEscrow)], ["Closing window", p.closing]].map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
      </Card>
    </div>

    <Card className="mt-6 overflow-x-auto">
      <div className="flex items-center justify-between p-5"><h2 className="font-semibold">Active commitments & cleared funds ({rows.length})</h2><Badge tone="green">Reconciled to ledger</Badge></div>
      <table className="w-full"><thead className="border-y border-border bg-ground"><tr><Th>Investor</Th><Th>Amount</Th><Th>Status</Th><Th>Wire ref</Th></tr></thead>
        <tbody className="divide-y divide-border">{rows.length === 0 && <tr><Td>No commitments yet — record one in Admin → Investments.</Td></tr>}
          {rows.map(({ i, c }) => <tr key={i.id}><Td>{c?.firm || c?.name}</Td><Td className="mono">{money(i.amount)}</Td><Td><Badge tone={i.status === "funded" ? "green" : i.status === "committed" ? "blue" : "amber"}>{i.status}</Badge></Td><Td className="mono text-muted">{i.wireRef || "—"}</Td></tr>)}</tbody></table>
    </Card>
  </>);
}
