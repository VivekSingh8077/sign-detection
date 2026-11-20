import type { ReactNode } from "react";
export const Page = ({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) => (
  <div className="mx-auto max-w-6xl space-y-6"><header><h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
    {sub && <p className="mt-1 text-slate-400">{sub}</p>}</header>{children}</div>);
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`glass p-5 ${className}`}>{children}</div>;
export const Stat = ({ label, value }: { label: string; value: ReactNode }) => (
  <Card><div className="text-sm text-slate-400">{label}</div><div className="mt-1 text-2xl font-semibold">{value}</div></Card>);
export const Dot = ({ ok }: { ok: boolean }) => <span className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-emerald-400" : "bg-slate-500"}`} />;
