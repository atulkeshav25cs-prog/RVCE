"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import AuthBackground from "@/components/AuthBackground";

export default function AuthorityLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/authority/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      router.push(data.redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthBackground type="authority" />
      <div className="min-h-[calc(100vh-90px)] flex items-center justify-center pt-[140px] pb-[80px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-2xl" style={{ background: 'rgba(6,18,40,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold tracking-widest text-slate-300 uppercase mb-4">
              Authority Portal
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to your authority account</p>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-grow" />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Or login via email</span>
            <div className="h-px bg-white/10 flex-grow" />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="Enter your official email"
                  className="block w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="block w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors sm:text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#0B1120] transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account? <a href="/authority/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Create Account</a>
          </p>
        </div>
      </div>
    </>
  );
}
