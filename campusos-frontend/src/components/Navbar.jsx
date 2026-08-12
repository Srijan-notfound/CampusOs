import { useEffect, useState } from "react";
import { Bell, Search, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error(
        "Failed to fetch unread count:",
        error
      );
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Check for new notifications every 10 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    const newState = !showNotifications;

    setShowNotifications(newState);

    if (newState) {
      await fetchNotifications();
    }
  };

  const markAsRead = async (notification) => {
    try {
      await api.patch(
        `/notifications/${notification.id}/read`
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification:",
        error
      );
    }
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-white/[0.07] bg-[#08090d]/70 px-8 backdrop-blur-2xl">

      <div className="flex h-full items-center justify-between">

        {/* Welcome */}
        <div>
          <p className="text-sm text-white/35">
            Welcome back !
          </p>

          <h2 className="text-lg font-semibold">
            Good morning, Srijan
          </h2>
        </div>

        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 md:flex">

            <Search
              size={17}
              className="text-white/30"
            />

            <input
              placeholder="Search..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-white/25"
            />

          </div>

          {/* Notifications */}
          <div className="relative">

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBellClick}
              className="relative rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >

              <Bell size={19} />

              {/* Notification count */}
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#08090d]">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}

            </motion.button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {showNotifications && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
                  }}
                  className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101117] shadow-2xl"
                >

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                    <div>
                      <h3 className="text-sm font-semibold">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs text-white/30">
                        {unreadCount} unread
                      </p>
                    </div>

                    <Bell
                      size={17}
                      className="text-indigo-400"
                    />

                  </div>

                  {/* Notifications */}
                  <div className="max-h-96 overflow-y-auto">

                    {loading ? (

                      <div className="p-6 text-center text-sm text-white/30">
                        Loading notifications...
                      </div>

                    ) : notifications.length === 0 ? (

                      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                        <div className="rounded-full bg-white/[0.04] p-3">
                          <CheckCircle2
                            size={22}
                            className="text-white/25"
                          />
                        </div>

                        <p className="mt-3 text-sm text-white/40">
                          You're all caught up
                        </p>

                        <p className="mt-1 text-xs text-white/20">
                          No notifications yet.
                        </p>

                      </div>

                    ) : (

                      notifications.map((notification) => (

                        <motion.button
                          key={notification.id}
                          whileHover={{
                            backgroundColor:
                              "rgba(255,255,255,0.03)",
                          }}
                          onClick={() =>
                            !notification.is_read &&
                            markAsRead(notification)
                          }
                          className={`flex w-full gap-3 border-b border-white/[0.05] px-5 py-4 text-left transition ${
                            notification.is_read
                              ? "opacity-50"
                              : ""
                          }`}
                        >

                          <div className="mt-1 shrink-0">

                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                notification.is_read
                                  ? "bg-white/10"
                                  : "bg-indigo-400"
                              }`}
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="text-sm leading-5 text-white/70">
                              {notification.message}
                            </p>

                            <p className="mt-1 text-[11px] text-white/25">
                              {notification.created_at
                                ? new Date(
                                    notification.created_at
                                  ).toLocaleString()
                                : ""}
                            </p>

                          </div>

                        </motion.button>

                      ))
                    )}

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold">
            S
          </div>

        </div>

      </div>

    </header>
  );
}