"use client";
import { useState } from "react";
import { useStore, actions, STAGES, derive, Accred, StageKey } from "@/lib/store";
import { money, cx } from "@/lib/fmt";
import { Card, PageHead, Btn, Badge, Modal, Field, inputCls, Th, Td } from "@/components/ui";
const TYPES = ["Individual", "Family Office", "Business Owner", "Institution", "Director/Organizer"];
const blank = { name: "", firm: "", type: "Individual", city: "", email: "", phone: "", target: "100000", accred: "not_started" as Accred, stage: "lead" as StageKey, notes: "" };
export default function Page() {
  const s = useStore(); const d = derive(s);
  const [f, setF] = useState<string>("all"); const [q, setQ] = useState(""); const [open, setOpen] = useState(false); const [edit, setEdit] = useState<string | null>(null); const [form, setForm] = useState(blank);
  const [imp, setImp] = useState(false); const [csv, setCsv] = useState("");
  const cic = new Map(d.cic.map(c => [c.id, c.pct]));
  const list = s.contacts.filter(c => (f === "all" || c.stage === f) && (c.name + c.firm + c.email).toLowerCase().includes(q.toLowerCase()));
  const save = () => { const t = Number(form.target) || 0; if (edit) actions.updateContact(edit, { ...form, target: t }); else actions.addContact({ ...form, target: t }); setOpen(false); setEdit(null); setForm(blank); };
  const exportCsv = () => { const rows = [["name", "firm", "type", "city", "email", "phone", "target", "accreditation", "stage", "notes"], ...s.contacts.map(c => [c.name, c.firm, c.type, c.city, c.email, c.phone, c.target, c.accred, c.stage, c.notes])];
    const b = new Blob([rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "investor-crm.csv"; a.click(); };
  const doImport = () => { csv.split("\n").map(l => l.trim()).filter(Boolean).forEach(l => { const [name, firm, email, target] = l.split(",").map(x => x.trim().replace(/^"|"$/g, "")); if (name) actions.addContact({ ...blank, name, firm: firm || "", email: email || "", target: Number(target) || 100000, source: "CSV import" }); }); setImp(false); setCsv(""); };
  return (<>
    <PageHead eyebrow="Investor CRM" title="Investors & prospects" sub="Name, fund, target check, 506(c) accreditation, stage and a 10% change-in-control flag in one table."
      action={<div className="flex flex-wrap gap-2"><Btn variant="ghost" onClick={() => setImp(true)}>Import CSV</Btn><Btn variant="ghost" onClick={exportCsv}>Export CSV</Btn><Btn onClick={() => { setForm(blank); setEdit(null); setOpen(true); }}>+ Add Contact</Btn></div>} />
    <div className="mb-4 flex flex-wrap items-center gap-2"><input className={cx(inputCls, "!w-64")} placeholder="Search name, firm, email" value={q} onChange={e => setQ(e.target.value)} />
      {["all", ...STAGES.map(x => x.k)].map(k => <button key={k} onClick={() => setF(k)} className={cx("rounded-full border px-3 py-1 text-xs", f === k ? "border-brand bg-blue-50 text-brand" : "border-border bg-white")}>{k === "all" ? "All stages" : STAGES.find(x => x.k === k)?.l}</button>)}</div>
    <Card className="overflow-x-auto"><table className="w-full"><thead className="border-b border-border bg-ground"><tr><Th>Investor / contact</Th><Th>Fund & target check</Th><Th>Accreditation (506(c))</Th><Th>Stage</Th><Th>Actions</Th></tr></thead>
      <tbody className="divide-y divide-border">
        {list.length === 0 && <tr><Td>No contacts match.</Td></tr>}
        {list.map(c => <tr key={c.id}>
          <Td><div className="font-semibold">{c.name}</div><div className="text-xs text-muted">{c.email}</div>{cic.has(c.id) && <Badge tone="red">≈{cic.get(c.id)!.toFixed(1)}% — CIC review</Badge>}</Td>
          <Td><div>{c.firm}</div><div className="mono text-xs text-muted">{money(c.target)} · {c.type}</div></Td>
          <Td><select aria-label="Accreditation" className="rounded-lg border border-border px-2 py-1 text-xs" value={c.accred} onChange={e => actions.setAccred(c.id, e.target.value as Accred)}><option value="not_started">not started</option><option value="pending">pending</option><option value="verified">verified</option><option value="failed">failed</option></select></Td>
          <Td><select aria-label="Stage" className="rounded-lg border border-border px-2 py-1 text-xs" value={c.stage} onChange={e => actions.moveStage(c.id, e.target.value as StageKey)}>{STAGES.map(x => <option key={x.k} value={x.k}>{x.l}</option>)}</select></Td>
          <Td><div className="flex gap-2"><Btn variant="ghost" className="!px-3 !py-1" onClick={() => { setEdit(c.id); setForm({ name: c.name, firm: c.firm, type: c.type, city: c.city, email: c.email, phone: c.phone, target: String(c.target), accred: c.accred, stage: c.stage, notes: c.notes }); setOpen(true); }}>Edit</Btn>
            <Btn variant="danger" className="!px-3 !py-1" onClick={() => { if (confirm(`Delete ${c.name}?`)) actions.deleteContact(c.id); }}>Delete</Btn></div></Td></tr>)}
      </tbody></table></Card>
    <Modal wide open={open} onClose={() => setOpen(false)} title={edit ? "Edit contact" : "Add contact"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name"><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Fund / firm"><input className={inputCls} value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })} /></Field>
        <Field label="Type"><select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
        <Field label="City"><input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
        <Field label="Email"><input className={inputCls} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Target check (USD)"><input className={inputCls} inputMode="numeric" value={form.target} onChange={e => setForm({ ...form, target: e.target.value.replace(/\D/g, "") })} /></Field>
        <Field label="Stage"><select className={inputCls} value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as StageKey })}>{STAGES.map(x => <option key={x.k} value={x.k}>{x.l}</option>)}</select></Field>
      </div>
      <div className="mt-3"><Field label="Notes"><textarea className={inputCls} rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field></div>
      <div className="mt-4"><Btn disabled={!form.name.trim()} onClick={save}>Save</Btn></div>
    </Modal>
    <Modal open={imp} onClose={() => setImp(false)} title="Import contacts (CSV)">
      <p className="mb-2 text-sm text-muted">One per line: <span className="mono">name, firm, email, target check</span></p>
      <textarea className={inputCls} rows={6} value={csv} onChange={e => setCsv(e.target.value)} placeholder={"Jane Smith, Smith Capital, jane@example.com, 250000"} />
      <div className="mt-3"><Btn disabled={!csv.trim()} onClick={doImport}>Import</Btn></div>
    </Modal>
  </>);
}
