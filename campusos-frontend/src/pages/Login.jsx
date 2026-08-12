import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        console.log("LOGIN DATA:", form);
console.log("API URL:", api.defaults.baseURL);
      const response = await api.post("/auth/login", form);

      const token =
        response.data.token ||
        response.data.accessToken;

      if (!token) {
        throw new Error("No token received from server");
      }

      login(token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-indigo-500/10 text-indigo-400">
            <Sparkles size={25} />
          </div>

          <h1 className="text-3xl font-bold">
            Welcome to Campus<span className="text-indigo-400">OS</span>
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Your intelligent student workspace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#101117]/80 p-8 shadow-2xl backdrop-blur-2xl">

          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Sign in
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Email
              </label>

              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 transition focus-within:border-indigo-500/50">
                <Mail size={18} className="text-white/30" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 transition focus-within:border-indigo-500/50">
                <Lock size={18} className="text-white/30" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-white/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}