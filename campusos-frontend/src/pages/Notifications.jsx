import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";
import api from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
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
    fetchNotifications();
  }, []);

  const markAsRead = async (notification) => {
    if (notification.is_read) return;

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
    } catch (error) {
      console.error(
        "Failed to mark notification:",
        error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <main className="min-h-screen px-5 pb-16 pt-28 sm:px-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-3 flex items-center gap-2 text-sm text-indigo-400">
          <Bell size={16} />
          Notifications
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Notifications
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Stay updated with what's happening in CampusOS.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/35">
                Total notifications
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loading ? "—" : notifications.length}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <Bell size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/35">
                Unread
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-400">
                {loading ? "—" : unreadCount}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <Circle size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* Notification list */}
      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="font-semibold">
            All Notifications
          </h2>

          <p className="mt-1 text-sm text-white/30">
            Your latest CampusOS updates.
          </p>
        </div>

        {loading ? (

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
              />
            ))}
          </div>

        ) : notifications.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-center">

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <CheckCircle2
                size={28}
                className="text-white/25"
              />
            </div>

            <h3 className="mt-4 font-medium">
              You're all caught up
            </h3>

            <p className="mt-1 text-sm text-white/30">
              No notifications available.
            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {notifications.map((notification, index) => (

              <motion.button
                key={notification.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                onClick={() =>
                  markAsRead(notification)
                }
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                  notification.is_read
                    ? "border-white/[0.05] bg-white/[0.015] opacity-50"
                    : "border-indigo-500/10 bg-indigo-500/[0.04] hover:bg-indigo-500/[0.07]"
                }`}
              >

                {/* Status icon */}
                <div className="mt-1 shrink-0">

                  {notification.is_read ? (
                    <CheckCircle2
                      size={20}
                      className="text-white/20"
                    />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15">
                      <div className="h-2 w-2 rounded-full bg-indigo-400" />
                    </div>
                  )}

                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-sm font-medium text-white/75">
                      {notification.message}
                    </p>

                    {!notification.is_read && (
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                        NEW
                      </span>
                    )}

                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">

                    <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] text-white/30">
                      {notification.type}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-white/25">
                      <Clock3 size={12} />

                      {notification.created_at
                        ? new Date(
                            notification.created_at
                          ).toLocaleString()
                        : ""}
                    </span>

                  </div>

                </div>

              </motion.button>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}