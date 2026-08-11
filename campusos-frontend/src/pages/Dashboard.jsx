import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");

        setTasks(response.data.tasks || response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pending = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
  ];

  return (
    <main className="min-h-screen px-8 pb-12 pt-28">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-indigo-400">
          Your overview
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-white/40">
          Stay on top of your academic life.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                  <Icon size={20} />
                </div>

                <span className="text-3xl font-bold">
                  {loading ? "—" : stat.value}
                </span>
              </div>

              <p className="mt-5 text-sm text-white/40">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent tasks */}
      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent Tasks</h2>
            <p className="mt-1 text-sm text-white/35">
              Your latest work
            </p>
          </div>

          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            View all →
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {loading ? (
            <p className="text-sm text-white/30">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-white/30">
              No tasks yet.
            </p>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    {task.priority} · {task.status}
                  </p>
                </div>

                {task.status === "COMPLETED" ? (
                  <CheckCircle2
                    size={19}
                    className="text-emerald-400"
                  />
                ) : (
                  <Clock3
                    size={19}
                    className="text-white/30"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-6 overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.10] to-purple-500/[0.04] p-7"
      >
        <div className="relative flex items-start gap-4">
          <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-400">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-indigo-300">
              CampusOS AI
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Need help planning your day?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Ask CampusOS AI to analyze your tasks and decide
              what you should focus on first.
            </p>

            <button className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-400">
              Ask CampusOS AI →
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}