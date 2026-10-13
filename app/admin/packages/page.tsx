"use client";
import { useState } from "react";
import { useStore, actions, DOC_PRESETS } from "@/lib/store";
import { when } from "@/lib/fmt";
import { Card, PageHead, Btn, Badge, Field, inputCls, Th, Td } from "@/components/ui";
export default function Page() {
  const s = useStore(); const [cid, setCid] = useState(""); const [pre, setPre] = useState("intro"); const [days, setDays] = useState("30"); const [msg, setMsg] = useState("");
  const contact = cid || s.contacts[0]?.id || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const make = () => { const p = actions.createPackage(contact, DOC_PRESETS[pre].docs, Number(days) || 30, DOC_PRESETS[pre].label); setMsg(`${origin}/p/${p.token}`); };
  return (<>
    <PageHead eyebrow="Tracked packages" title="Generate & dispatch diligence packages" sub="Each link is a 32-character token, watermarked with the recipient, and logged on every open. Offering documents stay locked until accreditation is verified." />
    <Card className="p-6"><div className="grid gap-3 sm:grid-cols-4">
      <Field label="Recipient"><select className={inputCls} value={contact} onChange={e => setCid(e.target.value)}>{s.contacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.firm}</option>)}</select></Field>
      <Field label="Package"><select className={inputCls} value={pre} onChange={e => setPre(e.target.value)}>{Object.entries(DOC_PRESETS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></Field>
      <Field label="Expires in (days)"><input className={inputCls} inputMode="numeric" value={days} onChange={e => setDays(e.target.value.replace(/\D/g, ""))} /></Field>
      <div className="flex items-end"><Btn disabled={!contact} onClick={make}>Generate & Dispatch</Btn></div></div>
      {msg && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm"><div className="font-semibold text-emerald-800">Package created (demo: no email is actually sent)</div><div className="mono mt-1 break-all text-xs">{msg}</div>
        <div className="mt-2 flex gap-2"><Btn variant="ghost" className="!py-1" onClick={() => navigator.clipboard?.writeText(msg)}>Copy link</Btn><a href={msg} target="_blank"><Btn className="!py-1">Open as investor</Btn></a></div></div>}
    </Card>
    <Card className="mt-6 overflow-x-auto"><table className="w-full"><thead className="border-b border-border bg-ground"><tr><Th>Recipient</Th><Th>Documents</Th><Th>Created</Th><Th>Opens</Th><Th>Link</Th></tr></thead>
      <tbody className="divide-y divide-border">{s.packages.length === 0 && <tr><Td>No packages yet.</Td></tr>}
        {s.packages.map(p => { const c = s.contacts.find(x => x.id === p.contactId); return <tr key={p.id}><Td>{c?.name}<div className="text-xs text-muted">{c?.firm}</div></Td><Td className="mono text-xs">{p.docs.join(", ")}</Td><Td className="text-muted">{when(p.created)}</Td>
          <Td><Badge tone={p.opens ? "green" : "gray"}>{p.opens} opens</Badge></Td><Td><a className="mono text-xs text-brand" target="_blank" href={`/p/${p.token}`}>/p/{p.token.slice(0, 10)}…</a></Td></tr>; })}</tbody></table></Card>
  </>);
}
