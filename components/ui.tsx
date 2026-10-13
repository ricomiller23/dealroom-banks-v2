"use client";
import React from "react";
import { cx } from "@/lib/fmt";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rounded-2xl border border-border bg-white shadow-sm", className)}>{children}</div>;
}
export function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "blue" | "green" | "amber" }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className={cx("mono mt-2 text-2xl font-semibold", tone === "blue" && "text-brand", tone === "green" && "text-emerald-600", tone === "amber" && "text-amber-600")}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </Card>
  );
}
const tones: Record<string, string> = {
  gray: "bg-slate-100 text-slate-700", blue: "bg-blue-50 text-brand", green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700",
};
export function Badge({ tone = "gray", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}
export function Btn({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return <button {...p} className={cx("inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40",
    variant === "primary" && "bg-brand text-white hover:bg-bright", variant === "ghost" && "border border-border bg-white text-ink hover:bg-ground",
    variant === "danger" && "bg-red-50 text-red-700 hover:bg-red-100", className)} />;
}
export function PageHead({ eyebrow, tag, title, sub, action }: { eyebrow: string; tag?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}{tag && <Badge tone="blue">{tag}</Badge>}</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={cx("max-h-[90vh] w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl", wide ? "max-w-2xl" : "max-w-lg")} onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full px-2 text-xl text-muted hover:bg-ground" aria-label="Close">×</button></div>
        {children}
      </div>
    </div>
  );
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="mb-1 block font-medium text-ink">{label}</span>{children}</label>;
}
export const inputCls = "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";
export function Bar({ value, tone = "bg-brand" }: { value: number; tone?: string }) {
  return <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={cx("h-full rounded-full", tone)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
export function Th({ children }: { children?: React.ReactNode }) { return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">{children}</th>; }
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) { return <td className={cx("px-4 py-3 text-sm align-top", className)}>{children}</td>; }
