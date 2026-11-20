import { NavLink } from "react-router-dom";
import { Hand, LayoutDashboard, Video, Library, History, Info } from "lucide-react";
const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard }, { to: "/live", label: "Live", icon: Video },
  { to: "/gestures", label: "Gestures", icon: Library }, { to: "/history", label: "History", icon: History },
  { to: "/about", label: "About", icon: Info },
];
export default function Sidebar() {
  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink/90 backdrop-blur md:inset-y-0 md:right-auto md:w-60 md:border-r md:border-t-0 md:p-5">
      <div className="mb-8 hidden items-center gap-2 md:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-blue"><Hand size={18} /></span>
        <span className="text-lg font-semibold">SignAI</span>
      </div>
      <nav className="flex justify-around md:block md:space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-2 py-2 text-[11px] transition md:flex-row md:gap-3 md:rounded-xl md:px-3 md:text-sm ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <Icon size={18} /><span>{label}</span>
          </NavLink>))}
      </nav>
    </aside>
  );
}
