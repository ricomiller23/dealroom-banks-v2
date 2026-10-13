"use client";
import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import manifest from "@/public/docs/manifest.json";
import { Card, PageHead, Badge } from "@/components/ui";
import { GATED_DOCS } from "@/lib/store";
import { cx } from "@/lib/fmt";

export default function Page() {
  const cats = ["All", ...Array.from(new Set(manifest.map(m => m.category)))];
  const [cat, setCat] = useState("All");
  const list = manifest.filter(m => cat === "All" || m.category === cat);
  return (<>
    <PageHead eyebrow="Diligence Vault" tag="SHA-256 verifiable" title={`${manifest.length} Hash-Signed Sample Artifacts`} sub="Real files with real SHA-256 digests. Open any artifact and press “Verify hash” to recompute the digest in your browser." />
    <div className="mb-4 flex flex-wrap gap-2">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={cx("rounded-full border px-3 py-1 text-sm", cat === c ? "border-brand bg-blue-50 text-brand" : "border-border bg-white")}>{c}</button>)}</div>
    <div className="grid gap-4 md:grid-cols-2">
      {list.map(m => (
        <Card key={m.code} className="p-5">
          <div className="flex items-start justify-between gap-2"><div><span className="mono text-xs text-muted">{m.code}</span><div className="font-semibold">{m.title}</div></div><Badge>{m.format}</Badge></div>
          <div className="mt-2 flex flex-wrap gap-2"><Badge tone="blue">{m.category}</Badge>{GATED_DOCS.includes(m.code) && <Badge tone="amber">506(c) gated in packages</Badge>}</div>
          <div className="mono mt-3 truncate text-xs text-muted">sha256 {m.sha256.slice(0, 24)}…</div>
          <div className="mt-3 flex items-center justify-between text-sm"><Link className="font-semibold text-brand" href={`/documents/${m.code}`}>Inspect artifact</Link>
            <a className="inline-flex items-center gap-1 text-muted hover:text-ink" href={`/docs/${m.file}`} download><Download size={14} />{(m.bytes / 1024).toFixed(1)} KB</a></div>
        </Card>))}
    </div>
  </>);
}
