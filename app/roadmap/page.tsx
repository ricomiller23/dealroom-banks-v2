"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, PageHead, Btn, Badge } from "@/components/ui";
import { cx } from "@/lib/fmt";
const STEPS = [
  ["Organizing group & pre-filing", "Form the organizing group, engage counsel, and hold pre-filing meetings with the chartering authority and the FDIC.", "Organizer list, counsel engagement, initial capital estimate"],
  ["Charter & deposit-insurance applications", "File the charter and federal deposit-insurance applications with the business plan, pro forma and management biographies.", "Business plan (D-02), pro forma (D-03), organizer bios (D-05)"],
  ["Holding-company filing", "If a holding company is used, file with the Federal Reserve; investors near 10% may need their own change-in-control filings.", "10% flags on every investor in the CRM"],
  ["Conditional approval", "Agencies issue conditional approvals with capital and time conditions. The clock to raise capital and open starts here.", "Approval date, outside date, conditions list (Fact Engine)"],
  ["Capital raise opens", "Open the offering to verified accredited investors. Subscriptions are held in escrow.", "Pipeline, 506(c) gate, tracked packages"],
  ["Escrow break", "Once the minimum is raised and conditions are met, funds are released to the Bank.", "Escrow progress bar on Overview and Raise pages"],
  ["Final approvals & exam readiness", "Satisfy remaining conditions, hire and train staff, complete systems readiness.", "Open terms ratified; documents versioned and hashed"],
  ["Open for business", "The Bank opens its doors; de novo supervisory period begins.", "Final cap table (D-09)"],
  ["Years 1–3 supervision", "Operate against the approved business plan; plan any follow-on capital early.", "Re-use the pipeline for growth capital raises"],
];
export default function Page() {
  const [i, setI] = useState(0); const [light, setLight] = useState(true);
  return (<>
    <PageHead eyebrow="Charter Roadmap" tag="Illustrative path" title="From pre-filing to opening day" sub="Timing varies by agency, state and facts. This is a planning aid, not regulatory advice." />
    <div className="mb-4 flex flex-wrap gap-2">{STEPS.map((s, k) => <button key={k} onClick={() => setI(k)} className={cx("rounded-full border px-3 py-1 text-xs", k === i ? "border-brand bg-blue-50 text-brand" : "border-border bg-white")}>{k + 1}</button>)}
      <Btn variant="ghost" className="ml-auto !py-1" onClick={() => setLight(!light)}>{light ? "Dark" : "Light"} panel</Btn></div>
    <Card className={cx("p-8", !light && "!bg-rail !text-white")}>
      <Badge tone="blue">Step {i + 1} of {STEPS.length}</Badge>
      <h2 className="mt-3 text-2xl font-semibold">{STEPS[i][0]}</h2>
      <p className={cx("mt-3 max-w-2xl", light ? "text-muted" : "text-slate-300")}>{STEPS[i][1]}</p>
      <div className={cx("mt-5 rounded-xl p-4 text-sm", light ? "bg-ground" : "bg-white/10")}><b>What DealRoom OS tracks here:</b> {STEPS[i][2]}</div>
      <div className="mt-6 flex gap-2"><Btn variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft size={14} />Previous</Btn><Btn disabled={i === STEPS.length - 1} onClick={() => setI(i + 1)}>Next<ChevronRight size={14} /></Btn></div>
    </Card>
  </>);
}
