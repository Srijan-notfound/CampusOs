import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ListTodo,
  Sparkles,
  Target,
  TrendingUp,
  CalendarDays,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");

        setTasks(response.data.tasks || response.data || []);
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

  const completionPercentage =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  const highPriority = tasks.filter(
    (task) =>
      task.priority === "HIGH" &&
      task.status !== "COMPLETED"
  ).length;

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 5);
  }, [tasks]);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "MEDIUM":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "LOW":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      default:
        return "border-white/10 bg-white/5 text-white/40";
    }
  };

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
      description: "All your tasks",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      description: `${completionPercentage}% completion`,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      description: "Tasks remaining",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: Target,
      description: "Needs attention",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-16 pt-28 sm:px-8">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute right-0 top-96 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-indigo-400">
              <Sparkles size={15} />
              <span>CampusOS Overview</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Good to see you again!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Stay organized, keep your momentum, and make
              progress one task at a time.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/tasks")}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
          >
            View all tasks
            <ArrowUpRight size={16} />
          </motion.button>

        </div>
      </motion.div>

      {/* STATS */}
      <div className="relative mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
            >

              {/* Hover glow */}
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">

                <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/10 p-3 text-indigo-400">
                  <Icon size={20} />
                </div>

                <span className="text-3xl font-bold tracking-tight">
                  {loading ? "—" : stat.value}
                </span>

              </div>

              <div className="relative mt-5">
                <p className="text-sm font-medium">
                  {stat.label}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  {stat.description}
                </p>
              </div>

            </motion.div>
          );
        })}

      </div>

      {/* MAIN GRID */}
      <div className="relative mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* RECENT TASKS */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl"
        >

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <ListTodo
                  size={18}
                  className="text-indigo-400"
                />

                <h2 className="font-semibold">
                  Recent Tasks
                </h2>
              </div>

              <p className="mt-1 text-sm text-white/30">
                Your latest work
              </p>
            </div>

            <button
              onClick={() => navigate("/tasks")}
              className="text-sm text-indigo-400 transition hover:text-indigo-300"
            >
              View all →
            </button>

          </div>

          <div className="mt-6 space-y-2">

            {loading ? (
              <>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[72px] animate-pulse rounded-xl bg-white/[0.03]"
                  />
                ))}
              </>
            ) : recentTasks.length === 0 ? (

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-12 text-center">

                <div className="mb-3 rounded-full bg-white/[0.04] p-3">
                  <ListTodo
                    size={22}
                    className="text-white/30"
                  />
                </div>

                <p className="text-sm text-white/50">
                  No tasks yet
                </p>

                <p className="mt-1 text-xs text-white/25">
                  Your tasks will appear here
                </p>

              </div>

            ) : (

              recentTasks.map((task, index) => (

                <motion.div
                  key={task.id}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.4 + index * 0.07,
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  className="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    {task.status === "COMPLETED" ? (
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-400"
                      />
                    ) : (
                      <Circle
                        size={19}
                        className="shrink-0 text-white/20"
                      />
                    )}

                    <div className="min-w-0">

                      <p
                        className={`truncate text-sm font-medium ${
                          task.status === "COMPLETED"
                            ? "text-white/40 line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2">

                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority || "NORMAL"}
                        </span>

                        <span className="text-[11px] text-white/25">
                          {task.status}
                        </span>

                      </div>

                    </div>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-white/10 transition group-hover:text-white/40"
                  />

                </motion.div>

              ))
            )}

          </div>
        </motion.section>

        {/* PRODUCTIVITY */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl"
        >

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-[70px]" />

          <div className="relative">

            <div className="flex items-center gap-2">
              <TrendingUp
                size={18}
                className="text-emerald-400"
              />

              <h2 className="font-semibold">
                Productivity
              </h2>
            </div>

            <p className="mt-1 text-sm text-white/30">
              Your task completion progress
            </p>

            {/* Progress circle */}
            <div className="mt-8 flex items-center justify-center">

              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-white/[0.04]">

                <div
                  className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-indigo-500 border-r-purple-500"
                  style={{
                    transform: `rotate(${completionPercentage * 3.6}deg)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {loading
                      ? "—"
                      : `${completionPercentage}%`}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    completed
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="text-xs text-white/30">
                  Completed
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {completed}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="text-xs text-white/30">
                  Remaining
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {pending}
                </p>
              </div>

            </div>

          </div>

        </motion.section>

      </div>

      {/* FOCUS + AI */}
      <div className="relative mt-6 grid gap-6 lg:grid-cols-2">

        {/* FOCUS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
        >

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
              <Target size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Your Focus
              </h2>

              <p className="text-sm text-white/30">
                What deserves your attention
              </p>
            </div>

          </div>

          <div className="mt-6">

            {highPriority > 0 ? (

              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.04] p-4">

                <div className="flex items-center gap-2 text-red-400">
                  <Target size={16} />

                  <span className="text-xs font-medium">
                    HIGH PRIORITY
                  </span>
                </div>

                <p className="mt-2 text-sm">
                  You have{" "}
                  <span className="font-semibold text-white">
                    {highPriority}
                  </span>{" "}
                  high-priority task
                  {highPriority > 1 ? "s" : ""} waiting.
                </p>

                <button
                  onClick={() => navigate("/tasks")}
                  className="mt-4 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Review tasks →
                </button>

              </div>

            ) : (

              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">

                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={16} />

                  <span className="text-xs font-medium">
                    ALL CLEAR
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/70">
                  No high-priority tasks are waiting.
                  Nice work.
                </p>

              </div>

            )}

          </div>

        </motion.div>

        {/* AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -3 }}
          className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.10] via-purple-500/[0.05] to-transparent p-6"
        >

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-[80px]" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div className="rounded-xl border border-indigo-400/10 bg-indigo-500/15 p-3 text-indigo-400">
                <Sparkles size={21} />
              </div>

              <span className="rounded-full border border-indigo-400/10 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium text-indigo-300">
                AI POWERED
              </span>

            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-indigo-300">
              CampusOS AI
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Plan your day smarter.
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
              Let CampusOS analyze your tasks and help
              you decide what deserves your attention first.
            </p>

            <button
              onClick={() => navigate("/ai")}
              className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-400"
            >
              Ask CampusOS AI
              <ArrowUpRight size={16} />
            </button>

          </div>

        </motion.div>

      </div>

      {/* FOOTER MINI INFO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative mt-6 flex flex-wrap items-center gap-5 text-xs text-white/25"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>CampusOS workspace</span>
        </div>

        <div className="h-1 w-1 rounded-full bg-white/20" />

        <div className="flex items-center gap-2">
          <Clock3 size={14} />
          <span>Stay consistent. Keep progressing.</span>
        </div>
      </motion.div>

    </main>
  );
}