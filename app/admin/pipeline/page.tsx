"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore, actions, STAGES, derive, StageKey } from "@/lib/store";
import { money, cx } from "@/lib/fmt";
import { PageHead, Btn, Badge } from "@/components/ui";
export default function Page() {
  const s = useStore(); const d = derive(s); const [over, setOver] = useState<string | null>(null);
  const cicIds = new Set(d.cic.map(c => c.id));
  return (<>
    <PageHead eyebrow="CRM Pipeline" title="Deal stages & investor funnel" sub="Drag a card to a new stage, or use the stage menu on the card." action={<Link href="/admin/contacts"><Btn>+ Add Contact</Btn></Link>} />
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STAGES.map(st => { const list = s.contacts.filter(c => c.stage === st.k); const total = list.reduce((a, c) => a + c.target, 0);
        return (
          <div key={st.k} onDragOver={e => { e.preventDefault(); setOver(st.k); }} onDragLeave={() => setOver(null)} onDrop={e => { const id = e.dataTransfer.getData("text/plain"); if (id) actions.moveStage(id, st.k); setOver(null); }}
            className={cx("w-64 shrink-0 rounded-2xl p-3", over === st.k ? "bg-blue-100" : "bg-slate-200/60")}>
            <div className="mb-2 flex items-center justify-between px-1"><span className="text-sm font-semibold">{st.l}</span><span className="mono text-xs text-muted">{list.length}</span></div>
            <div className="mono mb-2 px-1 text-[11px] text-muted">{money(total)} target</div>
            <div className="space-y-2">
              {list.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-muted">No contacts</div>}
              {list.map(c => (
                <div key={c.id} draggable onDragStart={e => e.dataTransfer.setData("text/plain", c.id)} className="cursor-grab rounded-xl border border-border bg-white p-3 shadow-sm active:cursor-grabbing">
                  <div className="text-sm font-semibold">{c.name}</div><div className="text-xs text-muted">{c.firm}</div>
                  <div className="mono mt-1 text-xs">{money(c.target)}</div>
                  <div className="mt-2 flex flex-wrap gap-1"><Badge tone={c.accred === "verified" ? "green" : c.accred === "pending" ? "amber" : "gray"}>506(c): {c.accred.replace("_", " ")}</Badge>{cicIds.has(c.id) && <Badge tone="red">10% flag</Badge>}</div>
                  <select aria-label={`Move ${c.name}`} className="mt-2 w-full rounded-lg border border-border bg-ground px-2 py-1 text-xs" value={c.stage} onChange={e => actions.moveStage(c.id, e.target.value as StageKey)}>{STAGES.map(x => <option key={x.k} value={x.k}>{x.l}</option>)}</select>
                </div>))}
            </div>
          </div>); })}
    </div></>);
}
