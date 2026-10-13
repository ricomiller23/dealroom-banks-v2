"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Building2, Landmark, DollarSign, FolderArchive, Scale, TrendingUp, Route, ShieldCheck, Users, Menu, X, Presentation, RotateCcw, Plus, Compass } from "lucide-react";
import { useStore, derive, actions } from "@/lib/store";
import { money, cx } from "@/lib/fmt";
import { Btn, Modal, Field, inputCls } from "./ui";

const NAV = [
  { href: "/", label: "Overview & Ledger", icon: LayoutDashboard },
  { href: "/executive-summary", label: "Executive Summary", icon: FileText },
  { href: "/company", label: "Organizers & Governance", icon: Building2 },
  { href: "/market", label: "Market & De Novo Landscape", icon: TrendingUp },
  { href: "/raise", label: "The Raise & Terms", icon: DollarSign },
  { href: "/documents", label: "Documents Vault", icon: FolderArchive },
  { href: "/reference", label: "Fact Engine & Open Terms", icon: Scale },
  { href: "/roadmap", label: "Charter Roadmap", icon: Route },
];

const TOUR = [
  { t: "Welcome to DealRoom OS — Bank Edition", d: "This is a live sandbox of a de novo bank capital raise. Everything you click works, and everything you change stays in your browser only." },
  { t: "1 · Living wire ledger", d: "The Overview and The Raise pages read from one ledger. Record a commitment in Admin → Investments and every number on every page updates." },
  { t: "2 · Investor CRM + pipeline", d: "Admin → Contacts is your investor CRM. Admin → Pipeline is a drag-and-drop board from Lead to Funded. Try moving a card." },
  { t: "3 · 506(c) gate + 10% change-in-control flag", d: "Offering documents are blocked for unverified investors. Anyone at or near 10% of voting shares is flagged for change-in-control review." },
  { t: "4 · Tracked, watermarked packages", d: "Admin → Packages creates a 32-character link per investor. Open it in a new tab to see the watermarked portal and log the open." },
  { t: "5 · Make it yours", d: "Click “+ Your Bank” to load your own bank name, target raise and share price into a blank pipeline." },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const s = useStore();
  const d = derive(s);
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [bankModal, setBankModal] = useState(false);
  const [present, setPresent] = useState(false);
  const [welcome, setWelcome] = useState<{ fn: string; bk: string } | null>(null);
  const [form, setForm] = useState({ name: "", holdco: "", target: "25000000", price: "10" });

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const ref = (q.get("ref") || "").slice(0, 40).replace(/[^\w-]/g, "");
      const fn = (q.get("fn") || "").slice(0, 40), bk = (q.get("bk") || "").slice(0, 80);
      if (ref) { try { sessionStorage.setItem("dr_ref", ref); if (fn) sessionStorage.setItem("dr_fn", fn); if (bk) sessionStorage.setItem("dr_bk", bk); } catch {} }
      const r = ref || sessionStorage.getItem("dr_ref") || "";
      const f = fn || sessionStorage.getItem("dr_fn") || "", b = bk || sessionStorage.getItem("dr_bk") || "";
      if (f || b) setWelcome({ fn: f, bk: b });
      if (r) { const body = JSON.stringify({ ref: r, path: window.location.pathname }); navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" })); }
    } catch {}
  }, [path]);
  useEffect(() => { document.documentElement.classList.toggle("present", present); }, [present]);

  const isPortal = path.startsWith("/p/");
  const admin = path.startsWith("/admin");

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">Skip to content</a>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-white/90 px-4 py-3 backdrop-blur lg:pl-72">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
          <Link href="/" className="flex items-center gap-2 lg:hidden"><span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm font-bold text-white">D</span><span className="font-semibold">DealRoom OS</span></Link>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline">● Active Capital Raise</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/raise" className="mono rounded-full border border-border px-3 py-1.5 hover:bg-ground">Raise: {money(d.committed)} <span className="text-muted">of {money(d.target)}</span></Link>
          <Link href="/admin" className="hidden rounded-full bg-ink px-3 py-1.5 font-semibold text-white sm:block">Admin CRM & Hub</Link>
        </div>
      </header>

      <aside className={cx("fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-rail p-4 text-slate-200 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <Link href="/" className="mb-6 flex items-center gap-2 px-2 pt-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-bold text-white">D</span>
          <div><div className="font-semibold text-white">DealRoom OS</div><div className="text-[11px] text-slate-400">{s.profile.name}</div></div></Link>
        <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Deal Room Navigation</div>
        <nav className="space-y-0.5">
          {NAV.map(n => { const I = n.icon; const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return <Link key={n.href} href={n.href} className={cx("flex items-center gap-3 rounded-xl px-3 py-2 text-sm", on ? "bg-white/10 text-white" : "hover:bg-white/5")}><I size={16} />{n.label}</Link>; })}
        </nav>
        <div className="mt-5 px-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Management & Admin</div>
        <Link href="/admin" className={cx("flex items-center gap-3 rounded-xl px-3 py-2 text-sm", admin ? "bg-white/10 text-white" : "hover:bg-white/5")}><Users size={16} />Admin CRM & Ledger</Link>
        <div className="mt-5 space-y-2 px-1">
          <Btn className="w-full !justify-start" onClick={() => setBankModal(true)}><Plus size={14} />Your Bank</Btn>
          <Btn variant="ghost" className="w-full !justify-start !bg-white/5 !text-slate-200 !border-white/10" onClick={() => setTour(0)}><Compass size={14} />Platform Tour</Btn>
          <Btn variant="ghost" className="w-full !justify-start !bg-white/5 !text-slate-200 !border-white/10" onClick={() => setPresent(!present)}><Presentation size={14} />{present ? "Exit" : "Present"} Mode</Btn>
          <Btn variant="ghost" className="w-full !justify-start !bg-white/5 !text-slate-200 !border-white/10" onClick={() => { if (confirm("Reset all demo data in this browser?")) actions.reset(); }}><RotateCcw size={14} />Reset Data</Btn>
        </div>
        <div className="mt-6 rounded-xl bg-white/5 p-3 text-xs text-slate-400"><ShieldCheck size={14} className="mb-1 text-emerald-400" />Rule 506(c) gate · watermarked links · 10% change-in-control flag · demo only</div>
      </aside>

      <main id="main" className="px-4 py-8 lg:pl-72 lg:pr-8">
        <div className="mx-auto max-w-6xl">
          {welcome && !isPortal && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
              <div><b>{welcome.fn ? `Welcome, ${welcome.fn}.` : "Welcome."}</b> This sandbox is for you to try — {welcome.bk ? `built around a fictional bank, with one click to load ${welcome.bk}'s name.` : "built around a fictional bank."}</div>
              <div className="flex gap-2"><Btn onClick={() => setTour(0)}>Take the 2-minute tour</Btn>
                {welcome.bk && <Btn variant="ghost" onClick={() => { actions.blank({ name: welcome.bk, holdco: welcome.bk + " Holdings" }); }}>Load {welcome.bk}</Btn>}
                <Btn variant="ghost" onClick={() => setWelcome(null)}>Dismiss</Btn></div>
            </div>)}
          {children}
          <footer className="mt-12 border-t border-border pt-6 text-xs text-muted">
            <div className="font-semibold text-ink">DealRoom OS • Living Diligence & Capital Raise Engine — Bank Edition</div>
            <p className="mt-2 max-w-3xl">DEMONSTRATION ONLY. {s.profile.name} is a fictional entity; all investors, figures and documents are sample data. Nothing here is an offer to sell or a solicitation of an offer to buy securities, and nothing is legal advice. Changes you make are stored only in this browser (Reset Data clears them).</p>
          </footer>
        </div>
      </main>

      <Modal open={tour !== null} onClose={() => setTour(null)} title={tour !== null ? TOUR[tour].t : ""}>
        {tour !== null && <>
          <p className="text-sm text-muted">{TOUR[tour].d}</p>
          <div className="mt-5 flex items-center justify-between"><span className="text-xs text-muted">Step {tour + 1} of {TOUR.length}</span>
            <div className="flex gap-2">{tour > 0 && <Btn variant="ghost" onClick={() => setTour(tour - 1)}>Back</Btn>}
              {tour < TOUR.length - 1 ? <Btn onClick={() => setTour(tour + 1)}>Next</Btn> : <Btn onClick={() => { setTour(null); }}>Start exploring</Btn>}</div></div></>}
      </Modal>
      <Modal open={bankModal} onClose={() => setBankModal(false)} title="Load your bank into a blank pipeline">
        <div className="space-y-3">
          <Field label="Bank name"><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. First Community Bank" /></Field>
          <Field label="Holding company (optional)"><input className={inputCls} value={form.holdco} onChange={e => setForm({ ...form, holdco: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target raise (USD)"><input className={inputCls} inputMode="numeric" value={form.target} onChange={e => setForm({ ...form, target: e.target.value.replace(/\D/g, "") })} /></Field>
            <Field label="Price per share (USD)"><input className={inputCls} inputMode="decimal" value={form.price} onChange={e => setForm({ ...form, price: e.target.value.replace(/[^\d.]/g, "") })} /></Field>
          </div>
          <p className="text-xs text-muted">This clears the sample investors so you can add your own. Stored in this browser only.</p>
          <Btn disabled={!form.name.trim()} onClick={() => { actions.blank({ name: form.name.trim(), holdco: form.holdco.trim() || form.name.trim() + " Holdings", target: Number(form.target) || 25_000_000, price: Number(form.price) || 10 }); setBankModal(false); }}>Create my sandbox</Btn>
        </div>
      </Modal>
    </div>
  );
}
