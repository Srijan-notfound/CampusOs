import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  Bot,
  Settings,
  User,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "AI Assistant", icon: Bot, path: "/ai" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.07] bg-[#0b0c11]/90 backdrop-blur-2xl">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
          <GraduationCap size={22} />
        </div>

        <div>
          <h1 className="font-bold tracking-tight">
            Campus<span className="text-indigo-400">OS</span>
          </h1>

          <p className="text-[11px] text-white/35">
            Student workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon size={19} />

              <span>{item.label}</span>

              {item.label === "Notifications" && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] text-white">
                  1
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-white/[0.07] p-3">

        <button
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/45 hover:bg-white/[0.04] hover:text-white"
        >
          <User size={19} />
          Profile
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/45 hover:bg-white/[0.04] hover:text-white"
        >
          <Settings size={19} />
          Settings
        </button>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400/70 hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>
    </aside>
  );
}