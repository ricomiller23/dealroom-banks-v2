"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore, actions, GATED_DOCS } from "@/lib/store";
import manifest from "@/public/docs/manifest.json";
import { Card, Badge, Btn } from "@/components/ui";
import { when } from "@/lib/fmt";

export default function Portal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const s = useStore(); const pkg = s.packages.find(p => p.token === token);
  const c = pkg && s.contacts.find(x => x.id === pkg.contactId);
  const logged = useRef(false); const [now] = useState(() => new Date().toISOString()); const [cert, setCert] = useState(false);
  useEffect(() => { if (pkg && !logged.current) { logged.current = true; actions.recordOpen(token, `/p/${token.slice(0, 10)}…`, "open"); } }, [pkg, token]);
  if (!pkg || !c) return (<Card className="mx-auto mt-10 max-w-lg p-8 text-center"><h1 className="text-xl font-semibold">Invalid or expired deal room link</h1><p className="mt-2 text-sm text-muted">This demo stores packages in the browser where they were created. Create one in Admin → Packages, or try the built-in demo link.</p>
    <div className="mt-4 flex justify-center gap-2"><Link href="/p/demo-investor"><Btn>Open demo package</Btn></Link><Link href="/"><Btn variant="ghost">Return to overview</Btn></Link></div></Card>);
  if (new Date(pkg.expires) < new Date()) return <Card className="mx-auto mt-10 max-w-lg p-8 text-center">This link has expired.</Card>;
  const docs = manifest.filter(m => pkg.docs.includes(m.code));
  const wm = `${c.email} · ${when(now)} · CONFIDENTIAL`;
  const verified = c.accred === "verified";
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden opacity-[0.07]"><div className="mono -rotate-24 whitespace-pre text-lg font-bold leading-[5rem]">{Array.from({ length: 14 }, () => (wm + "      ").repeat(5)).join("\n")}</div></div>
      <Card className="p-6"><Badge tone="blue">Secure investor portal</Badge>
        <h1 className="mt-2 text-2xl font-semibold">{s.profile.name} — data room for {c.name}</h1>
        <p className="mt-1 text-sm text-muted">Watermarked for {c.email}. Access is logged.</p></Card>
      {!verified && <Card className="mt-4 border-amber-300 bg-amber-50 p-5 text-sm"><b>Offering documents are locked.</b> Rule 506(c) requires reasonable steps to verify accredited-investor status before you can view offering documents.
        <label className="mt-3 flex items-start gap-2"><input type="checkbox" checked={cert} onChange={e => setCert(e.target.checked)} className="mt-1" /><span>I believe I qualify as an accredited investor and will provide verification (letter from a CPA, attorney, broker-dealer or RIA; or documents).</span></label>
        <Btn className="mt-3" disabled={!cert} onClick={() => { actions.setAccred(c.id, "pending"); actions.recordOpen(token, "accreditation submitted", "gate_pass"); }}>Submit for verification</Btn>
        {c.accred === "pending" && <div className="mt-2 text-amber-800">Submitted — the bank must confirm your verification before documents unlock.</div>}</Card>}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {docs.map(m => { const locked = GATED_DOCS.includes(m.code) && !verified;
          return <Card key={m.code} className="p-5"><div className="flex justify-between"><div><span className="mono text-xs text-muted">{m.code}</span><div className="font-semibold">{m.title}</div></div>{locked ? <Badge tone="amber">Locked · 506(c)</Badge> : <Badge tone="green">Available</Badge>}</div>
            <div className="mt-3">{locked ? <Btn variant="ghost" onClick={() => actions.recordOpen(token, `${m.code} blocked`, "gate_block")}>Why is this locked?</Btn> :
              <a href={`/docs/${m.file}`} target="_blank" onClick={() => actions.recordOpen(token, m.code, "view_doc")}><Btn variant="ghost">View document</Btn></a>}</div></Card>; })}
      </div>
    </div>);
}
