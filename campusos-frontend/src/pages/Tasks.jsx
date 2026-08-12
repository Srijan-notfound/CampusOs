import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  X,
  CalendarDays,
  Clock3,
  ListTodo,
} from "lucide-react";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    due_date: "",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

      setTasks(response.data.tasks || response.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/tasks", {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.due_date || null,
      });

      const newTask = response.data.task || response.data;

      setTasks((current) => [newTask, ...current]);

      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        due_date: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  const toggleTask = async (task) => {
    const newStatus =
      task.status === "COMPLETED"
        ? "PENDING"
        : "COMPLETED";

    try {
      const response = await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        dueDate: task.due_date,
      });

      const updatedTask =
        response.data.task || response.data;

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error("Update task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Delete task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    }
  };

  const getPriorityStyle = (priority) => {
    if (priority === "HIGH") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    if (priority === "MEDIUM") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  };

  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <main className="min-h-screen px-5 pb-16 pt-28 sm:px-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-5 md:flex-row md:items-end"
      >
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-indigo-400">
            <ListTodo size={16} />
            Task management
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Tasks
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Organize your academic work and stay ahead.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-400"
        >
          <Plus size={18} />
          New Task
        </motion.button>
      </motion.div>

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm text-white/35">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold">
            {loading ? "—" : tasks.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm text-white/35">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {loading ? "—" : completed}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm text-white/35">
            Remaining
          </p>

          <p className="mt-2 text-3xl font-bold text-indigo-400">
            {loading ? "—" : tasks.length - completed}
          </p>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* TASK LIST */}
      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              All Tasks
            </h2>

            <p className="mt-1 text-sm text-white/30">
              Everything you need to get done.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-white/[0.03]"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-20 text-center">

            <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400">
              <ListTodo size={28} />
            </div>

            <h3 className="mt-4 font-medium">
              No tasks yet
            </h3>

            <p className="mt-1 text-sm text-white/30">
              Create your first task and get started.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium hover:bg-indigo-400"
            >
              <Plus size={16} />
              Create task
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            <AnimatePresence>
              {tasks.map((task) => (

                <motion.div
                  key={task.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.11] hover:bg-white/[0.035]"
                >

                  <div className="flex min-w-0 items-start gap-4">

                    <button
                      onClick={() => toggleTask(task)}
                      className="mt-1 shrink-0"
                    >
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2
                          size={21}
                          className="text-emerald-400"
                        />
                      ) : (
                        <Circle
                          size={21}
                          className="text-white/20 transition hover:text-indigo-400"
                        />
                      )}
                    </button>

                    <div className="min-w-0">

                      <h3
                        className={`truncate text-sm font-medium ${
                          task.status === "COMPLETED"
                            ? "text-white/35 line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-white/30">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-md border px-2 py-1 text-[10px] font-medium ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        {task.due_date && (
                          <span className="flex items-center gap-1 text-[11px] text-white/25">
                            <CalendarDays size={12} />
                            {new Date(
                              task.due_date
                            ).toLocaleDateString()}
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-[11px] text-white/25">
                          <Clock3 size={12} />
                          {task.status}
                        </span>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="shrink-0 rounded-lg p-2 text-white/20 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={17} />
                  </button>

                </motion.div>

              ))}
            </AnimatePresence>

          </div>
        )}

      </section>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              className="w-full max-w-lg rounded-2xl border border-white/[0.09] bg-[#101117] p-6 shadow-2xl"
            >

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    Create a task
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Add something you need to accomplish.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              <form
                onSubmit={createTask}
                className="mt-6 space-y-4"
              >

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Complete DBMS assignment"
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add some details..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500/50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#15161d] px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                    >
                      <option value="LOW">
                        Low
                      </option>

                      <option value="MEDIUM">
                        Medium
                      </option>

                      <option value="HIGH">
                        High
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Due date
                    </label>

                    <input
                      type="date"
                      name="due_date"
                      value={form.due_date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={17} />

                  {creating
                    ? "Creating..."
                    : "Create Task"}
                </button>

              </form>

            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>

    </main>
  );
}