"use client";
import { use, useState } from "react";
import Link from "next/link";
import manifest from "@/public/docs/manifest.json";
import { Card, PageHead, Btn, Badge } from "@/components/ui";

export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const m = manifest.find(x => x.code === code.toUpperCase());
  const [res, setRes] = useState<string>("");
  if (!m) return <Card className="p-8">Document not found. <Link className="text-brand" href="/documents">Back to vault</Link></Card>;
  async function verify() {
    setRes("Computing…");
    try {
      const buf = await (await fetch(`/docs/${m!.file}`, { cache: "no-store" })).arrayBuffer();
      const h = await crypto.subtle.digest("SHA-256", buf);
      const hex = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
      setRes(hex === m!.sha256 ? `✓ MATCH — ${hex}` : `✗ MISMATCH — got ${hex}`);
    } catch { setRes("Could not fetch file."); }
  }
  return (<>
    <PageHead eyebrow={m.code} tag={m.category} title={m.title} sub={m.file} action={<Link href="/documents"><Btn variant="ghost">Back to vault</Btn></Link>} />
    <Card className="p-6">
      <dl className="grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-muted">Format</dt><dd className="font-semibold">{m.format}</dd></div><div><dt className="text-muted">Size</dt><dd className="font-semibold">{(m.bytes / 1024).toFixed(1)} KB</dd></div><div><dt className="text-muted">Version</dt><dd className="font-semibold">1.0 (current)</dd></div></dl>
      <div className="mono mt-4 break-all rounded-xl bg-ground p-3 text-xs">{m.sha256}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Btn onClick={verify}>Verify hash in my browser</Btn><a href={`/docs/${m.file}`} download><Btn variant="ghost">Download</Btn></a><a href={`/docs/${m.file}`} target="_blank"><Btn variant="ghost">Open in new tab</Btn></a></div>
      {res && <div className={`mono mt-3 break-all text-xs ${res.startsWith("✓") ? "text-emerald-700" : "text-red-700"}`}>{res}</div>}
      {m.format === "PDF" && <iframe title={m.title} src={`/docs/${m.file}`} className="mt-5 h-[600px] w-full rounded-xl border border-border" />}
    </Card>
  </>);
}
