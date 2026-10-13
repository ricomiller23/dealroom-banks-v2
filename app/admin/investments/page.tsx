"use client";
import { useState } from "react";
import { useStore, actions, derive, InvStatus } from "@/lib/store";
import { money, when } from "@/lib/fmt";
import { Card, PageHead, Btn, Badge, Modal, Field, inputCls, Th, Td, Stat } from "@/components/ui";
export default function Page() {
  const s = useStore(); const d = derive(s); const [open, setOpen] = useState(false);
  const [f, setF] = useState({ contactId: "", amount: "100000", status: "committed" as InvStatus, wireRef: "" });
  const min = s.profile.minCheck; const amt = Number(f.amount) || 0;
  return (<>
    <PageHead eyebrow="Ledger" title="Investments & commitment ledger" sub="Soft circles, signed commitments and cleared wires. Totals feed every page." action={<Btn onClick={() => { setF({ ...f, contactId: s.contacts[0]?.id ?? "" }); setOpen(true); }} disabled={!s.contacts.length}>Record Investment</Btn>} />
    <div className="mb-4 grid gap-4 sm:grid-cols-3"><Stat label="Committed" value={money(d.committed)} tone="blue" /><Stat label="Funded" value={money(d.funded)} tone="green" /><Stat label="Soft" value={money(d.soft)} tone="amber" /></div>
    <Card className="overflow-x-auto"><table className="w-full"><thead className="border-b border-border bg-ground"><tr><Th>Investor</Th><Th>Amount</Th><Th>Status</Th><Th>Wire reference</Th><Th>Date</Th><Th /></tr></thead>
      <tbody className="divide-y divide-border">{s.investments.length === 0 && <tr><Td>0 records.</Td></tr>}
        {s.investments.map(i => { const c = s.contacts.find(x => x.id === i.contactId); return <tr key={i.id}><Td>{c?.firm || c?.name}</Td><Td className="mono">{money(i.amount)}</Td>
          <Td><select className="rounded-lg border border-border px-2 py-1 text-xs" value={i.status} onChange={e => actions.updateInvestment(i.id, { status: e.target.value as InvStatus })}><option value="soft">soft</option><option value="committed">committed</option><option value="funded">funded</option></select></Td>
          <Td className="mono text-muted">{i.wireRef || "—"}</Td><Td className="text-muted">{when(i.date)}</Td><Td><Btn variant="danger" className="!px-3 !py-1" onClick={() => actions.deleteInvestment(i.id)}>Remove</Btn></Td></tr>; })}</tbody></table></Card>
    <Modal open={open} onClose={() => setOpen(false)} title="Record investment">
      <div className="space-y-3">
        <Field label="Investor"><select className={inputCls} value={f.contactId} onChange={e => setF({ ...f, contactId: e.target.value })}>{s.contacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.firm}</option>)}</select></Field>
        <Field label="Amount (USD)"><input className={inputCls} inputMode="numeric" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value.replace(/\D/g, "") })} /></Field>
        <Field label="Status"><select className={inputCls} value={f.status} onChange={e => setF({ ...f, status: e.target.value as InvStatus })}><option value="soft">soft</option><option value="committed">committed</option><option value="funded">funded (wire cleared)</option></select></Field>
        <Field label="Wire reference"><input className={inputCls} value={f.wireRef} onChange={e => setF({ ...f, wireRef: e.target.value })} /></Field>
        {f.status !== "soft" && amt < min && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Below the {money(min)} minimum subscription.</div>}
        <Btn disabled={!f.contactId || amt <= 0 || (f.status !== "soft" && amt < min)} onClick={() => { actions.addInvestment({ contactId: f.contactId, amount: amt, status: f.status, wireRef: f.wireRef }); setOpen(false); }}>Record</Btn>
      </div></Modal>
  </>);
}
