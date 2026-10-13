"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, PageHead, Btn } from "@/components/ui";
export default function Page() {
  const s = useStore(); const p = s.profile;
  const kv = (rows: [string, string][]) => <dl className="mt-3 divide-y divide-border text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>;
  return (<>
    <PageHead eyebrow="Corporate Governance" tag="Entity · Organizers · Counsel" title={`${p.name} Organization`} action={<Link href="/documents"><Btn variant="ghost">Vault Documents</Btn></Link>} />
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6"><h2 className="font-semibold">Entity</h2>{kv([["Bank", p.name], ["Holding company", p.holdco], ["Charter", p.charter], ["Location", `${p.city}, ${p.state}`]])}</Card>
      <Card className="p-6"><h2 className="font-semibold">Compliance & counsel</h2>{kv([["Securities counsel", p.counsel], ["Exemption", p.exemption], ["Escrow", "Independent escrow agent"], ["Data room", "32-character tokens · watermarking"]])}</Card>
    </div>
    <Card className="mt-6 p-6"><h2 className="font-semibold">Organizing group (fictional)</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        {[[p.ceo, "Chair & CEO designate"], [p.cfo, "CFO designate"], ["Priya Natarajan", "Chief Credit Officer designate"], ["Tom Whitaker", "Counsel liaison"]].map(([n, r]) => <div key={n} className="rounded-xl bg-ground p-4"><div className="font-semibold">{n}</div><div className="text-muted">{r}</div></div>)}</div></Card>
  </>);
}
