"use client";
import { useStore } from "@/lib/store";
import { when } from "@/lib/fmt";
import { Card, PageHead, Badge } from "@/components/ui";
export default function Page() {
  const s = useStore();
  return (<>
    <PageHead eyebrow="Audit trail" title="Global activity & telemetry log" sub="Every CRM change, package dispatch and viewer access event, newest first." />
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6"><h2 className="font-semibold">CRM activities ({s.activity.length})</h2><ul className="mt-3 space-y-2 text-sm">{s.activity.map(a => <li key={a.id}>{a.text}<div className="text-xs text-muted">{a.type} · {when(a.ts)} · admin</div></li>)}</ul></Card>
      <Card className="p-6"><h2 className="font-semibold">Access events ({s.events.length})</h2><ul className="mt-3 space-y-2 text-sm">{s.events.map(e => <li key={e.id}><Badge tone={e.event === "gate_block" ? "red" : "blue"}>{e.event}</Badge> <span className="mono text-xs">{e.detail}</span><div className="mono text-xs text-muted">{e.actor} · {when(e.ts)}</div></li>)}</ul></Card>
    </div></>);
}
