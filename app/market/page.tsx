"use client";
import Link from "next/link";
import { Card, PageHead, Btn } from "@/components/ui";
const OPENINGS: [string, number][] = [["2010",2],["2011",0],["2012",0],["2013",1],["2014",0],["2015",1],["2016",0],["2017",3],["2018",6],["2019",13],["2020",7],["2021",9],["2022",14],["2023",6],["2024",6],["2025",3],["2026",8]];
export default function Page() {
  const max = Math.max(...OPENINGS.map(o => o[1]));
  return (<>
    <PageHead eyebrow="Market Intelligence" tag="Landscape · Comps" title="De Novo Landscape & Service-Area Market" action={<Link href="/raise"><Btn>Raise Terms</Btn></Link>} />
    <Card className="p-6">
      <h2 className="font-semibold">Strict true de novo bank openings, 2010–2026</h2>
      <p className="mt-1 text-xs text-muted">Source: de novo research workbook (as of Oct 12, 2026) built from FDIC deposit-insurance decisions. 79 strict true de novos; 28 pending/organizing institutions tracked.</p>
      <div className="mt-6 flex h-48 items-end gap-2" role="img" aria-label="Bar chart of de novo openings by year">
        {OPENINGS.map(([y, n]) => <div key={y} className="flex flex-1 flex-col items-center gap-1"><span className="mono text-[11px] text-muted">{n}</span>
          <div className="w-full rounded-t bg-brand" style={{ height: `${(n / max) * 100}%`, minHeight: n ? 4 : 1 }} /><span className="text-[10px] text-muted">{y.slice(2)}</span></div>)}
      </div>
    </Card>
    <Card className="mt-6 overflow-x-auto p-6"><h2 className="font-semibold">Illustrative service-area comps (sample data)</h2>
      <table className="mt-3 w-full text-sm"><thead><tr className="text-left text-xs uppercase text-muted"><th className="py-2">Peer group</th><th>Loans / deposits</th><th>NIM</th><th>Efficiency</th></tr></thead>
        <tbody className="divide-y divide-border">{[["De novo peers (yr 1–3)", "68%", "3.4%", "118%"], ["Community banks < $1B", "81%", "3.6%", "67%"], ["Larkspur Y3 target", "84%", "3.6%", "78%"]].map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i} className="py-2">{c}</td>)}</tr>)}</tbody></table></Card>
  </>);
}
