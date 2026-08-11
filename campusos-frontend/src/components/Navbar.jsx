import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-white/[0.07] bg-[#08090d]/70 px-8 backdrop-blur-2xl">
      <div className="flex h-full items-center justify-between">

        <div>
          <p className="text-sm text-white/35">Welcome back 👋</p>
          <h2 className="text-lg font-semibold">
            Good morning, Srijan
          </h2>
        </div>

        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 md:flex">
            <Search size={17} className="text-white/30" />

            <input
              placeholder="Search..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-white/25"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-white/50 transition hover:bg-white/[0.06] hover:text-white">
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-[#08090d]" />
          </button>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold">
            S
          </div>
        </div>
      </div>
    </header>
  );
}