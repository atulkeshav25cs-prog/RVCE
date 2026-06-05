"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import AuthBackground from "@/components/AuthBackground";

export default function CitizenSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    bloodGroup: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/citizen/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
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
      <AuthBackground type="citizen" />
      <div className="min-h-[calc(100vh-90px)] flex items-center justify-center pt-[140px] pb-[80px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-lg space-y-8 p-10 rounded-2xl shadow-2xl" style={{ background: 'rgba(6,18,40,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold tracking-widest text-slate-300 uppercase mb-4">
              Citizen Portal
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Your Account</h2>
            <p className="mt-2 text-sm text-slate-400">Join the National Emergency Authority</p>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-grow" />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Or register via email</span>
            <div className="h-px bg-white/10 flex-grow" />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input required type="text" placeholder="Enter your full name" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input required type="email" placeholder="Enter your email address" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input required type="text" placeholder="Phone number" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                <select required className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm appearance-none" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                <input required type="number" placeholder="Age" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group (Optional)</label>
                <input type="text" placeholder="e.g. O+" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} placeholder="Confirm your password" className="block w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#0B1120] transition-colors">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account? <a href="/citizen/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
}
