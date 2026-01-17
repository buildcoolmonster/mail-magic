import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Send, Paperclip, History, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/templates", icon: FileText, label: "Templates" },
  { to: "/recipients", icon: Users, label: "Recipients" },
  { to: "/attachments", icon: Paperclip, label: "Attachments" },
  { to: "/send", icon: Send, label: "Send Emails" },
  { to: "/logs", icon: History, label: "Logs" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-sidebar p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Mail className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">AutoJobMailer</h1>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground pt-4 border-t">
          v1.0.0 - Phase 2
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
