"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore, actions } from "@/lib/store";
import { when, cx } from "@/lib/fmt";
import { Card, PageHead, Btn, Badge, Th, Td, inputCls } from "@/components/ui";
export default function Page() {
  const s = useStore(); const [flt, setFlt] = useState("all"); const [ed, setEd] = useState<string | null>(null); const [v, setV] = useState("");
  const list = s.facts.filter(f => flt === "all" || f.status === flt);
  return (<>
    <PageHead eyebrow="Source of Truth" title="Facts explorer & editor" sub="Every literal number and term is governed by this table. Updates take effect across all pages instantly." action={<Link href="/admin"><Btn variant="ghost">Back to Dashboard</Btn></Link>} />
    <div className="mb-3 flex gap-2">{["all", "confirmed", "open"].map(k => <button key={k} onClick={() => setFlt(k)} className={cx("rounded-full border px-3 py-1 text-xs", flt === k ? "border-brand bg-blue-50 text-brand" : "border-border bg-white")}>{k}</button>)}</div>
    <Card className="overflow-x-auto"><table className="w-full"><thead className="border-b border-border bg-ground"><tr><Th>Key</Th><Th>Label</Th><Th>Value</Th><Th>Status</Th><Th>Action</Th></tr></thead>
      <tbody className="divide-y divide-border">{list.map(f => <tr key={f.key}><Td className="mono text-xs">{f.key}</Td><Td>{f.label}</Td>
        <Td>{ed === f.key ? <input autoFocus className={inputCls} value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { actions.setFact(f.key, v); setEd(null); } }} /> : <span className="font-medium">{f.value}</span>}</Td>
        <Td><Badge tone={f.status === "open" ? "amber" : "green"}>{f.status}</Badge></Td>
        <Td>{ed === f.key ? <div className="flex gap-2"><Btn className="!px-3 !py-1" onClick={() => { actions.setFact(f.key, v); setEd(null); }}>Save</Btn><Btn variant="ghost" className="!px-3 !py-1" onClick={() => setEd(null)}>Cancel</Btn></div> :
          <div className="flex gap-2"><Btn variant="ghost" className="!px-3 !py-1" onClick={() => { setEd(f.key); setV(f.value); }}>Edit</Btn>{f.status === "open" && <Btn className="!px-3 !py-1" onClick={() => actions.setFact(f.key, f.value, "confirmed")}>Confirm</Btn>}</div>}</Td></tr>)}</tbody></table></Card>
    {s.factHistory.length > 0 && <Card className="mt-6 p-5"><h2 className="font-semibold">Change history</h2><ul className="mono mt-2 space-y-1 text-xs">{s.factHistory.slice(0, 10).map((h, i) => <li key={i}>{when(h.ts)} · {h.key}: “{h.old}” → “{h.next}”</li>)}</ul></Card>}
  </>);
}
