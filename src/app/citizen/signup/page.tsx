"use client";

import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

// Phone validation for Indian numbers (optional +91, 10 digits)
const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

const citizenSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  emailAddress: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid Indian phone number"),
  gender: z.string().min(1, "Gender is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(120),
  bloodGroup: z.string().optional(),
  trustedContacts: z.array(
    z.object({
      name: z.string().min(2, "Name is required"),
      email: z.string().email("Invalid email address").optional().or(z.literal("")),
      phone: z.string().regex(phoneRegex, "Invalid Indian phone number"),
    })
  ).min(1, "At least 1 trusted contact is required").max(3, "Maximum 3 trusted contacts allowed"),
});

type CitizenFormValues = z.infer<typeof citizenSchema>;

export default function CitizenSignup() {
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const clerk = useClerk();
  const router = useRouter();

  if (typeof window !== "undefined") {
    (window as any).__DEBUG_SIGNIN = signIn;
    (window as any).__DEBUG_SIGNUP = signUp;
    (window as any).__DEBUG_CLERK = clerk;
  }
  
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthResult, setOauthResult] = useState<any>(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm<CitizenFormValues>({
    resolver: zodResolver(citizenSchema),
    defaultValues: {
      trustedContacts: [{ name: "", email: "", phone: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "trustedContacts"
  });

  const onSubmit = async (data: CitizenFormValues) => {
    setLoading(true);
    setError("");

    try {
      // 1. Create user in Clerk
      await signUp?.create({
        emailAddress: data.emailAddress,
      });

      // 2. Attach extensive custom metadata
      await signUp?.update({
        publicMetadata: {
          role: "citizen",
          fullName: data.fullName,
          phone: data.phone, // In production, normalize this to +91...
          gender: data.gender,
          age: data.age,
          bloodGroup: data.bloodGroup || "Not Provided",
          trustedContacts: data.trustedContacts,
        }
      });

      // 3. Prepare Email OTP Verification
      const res = await signUp?.verifications.sendEmailCode();
      if (res?.error) {
        throw res.error;
      }
      setVerifying(true);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signUp?.verifications.verifyEmailCode({ code });
      
      if (res?.error) {
        throw res.error;
      }

      if (signUp?.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/citizen/onboarding");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    console.log("Google button clicked");
    console.log("Object.keys(signIn):", signIn ? Object.keys(signIn) : "undefined");
    console.log("typeof signIn.sso:", signIn ? typeof signIn.sso : "undefined");
    console.log("Starting OAuth");
    
    try {
      const result = await signIn?.sso({
        strategy: "oauth_google",
        redirectUrl: "/citizen/onboarding",
        redirectCallbackUrl: "/sso-callback",
      });
      setOauthResult(result);
      console.log("OAuth result JSON:", JSON.stringify(result, null, 2));
      console.dir(result);
      if (result?.error) {
        console.error("OAuth Error:", result.error);
        console.error("OAuth Error JSON:", JSON.stringify(result.error, null, 2));
      }
    } catch (err: any) {
      console.error("OAuth error caught:", err);
      console.error("Message:", err.message);
      console.error("Errors array:", err.errors);
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "An unexpected error occurred during Google authentication.");
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] py-32 px-6">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-3xl w-full max-w-2xl shadow-glass">
        
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-4 rounded-sm">
            Civilian Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
            Create Profile
          </h1>
          <p className="text-white/60 font-medium text-sm">
            Register your details securely with the National Emergency Authority.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {oauthResult && (
          <div className="mb-6 p-4 bg-black/50 border border-emerald-500/50 rounded-lg text-left overflow-auto">
            <h3 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">OAuth Debug Result</h3>
            <pre className="text-emerald-300 text-[10px] whitespace-pre-wrap">{JSON.stringify(oauthResult, null, 2)}</pre>
          </div>
        )}

        {!verifying ? (
          <>
            <button 
              onClick={handleOAuth}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-slate-200 transition-all mb-8"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-grow"></div>
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Or register via email</span>
              <div className="h-px bg-white/10 flex-grow"></div>
            </div>

            <div id="clerk-captcha"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                  <input {...register("fullName")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" {...register("emailAddress")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="john@example.com" />
                  {errors.emailAddress && <p className="text-red-400 text-xs mt-1">{errors.emailAddress.message}</p>}
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
                  <input {...register("phone")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="9876543210" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Gender</label>
                  <select {...register("gender")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Age</label>
                  <input type="number" {...register("age")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="25" />
                  {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Blood Group (Optional)</label>
                  <select {...register("bloodGroup")} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold uppercase tracking-wider text-sm">Trusted Contacts</h3>
                  {fields.length < 3 && (
                    <button type="button" onClick={() => append({ name: "", email: "", phone: "" })} className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 tracking-wider">
                      <Plus size={12} /> Add Contact
                    </button>
                  )}
                </div>
                <p className="text-white/50 text-xs mb-6">Provide at least 1 emergency contact. Maximum 3.</p>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative">
                      {index > 0 && (
                        <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                      <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Contact 0{index + 1}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input {...register(`trustedContacts.${index}.name`)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none text-sm" placeholder="Contact Name" />
                          {errors.trustedContacts?.[index]?.name && <p className="text-red-400 text-xs mt-1">{errors.trustedContacts[index]?.name?.message}</p>}
                        </div>
                        <div>
                          <input {...register(`trustedContacts.${index}.phone`)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none text-sm" placeholder="Phone Number" />
                          {errors.trustedContacts?.[index]?.phone && <p className="text-red-400 text-xs mt-1">{errors.trustedContacts[index]?.phone?.message}</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <input type="email" {...register(`trustedContacts.${index}.email`)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none text-sm" placeholder="Email (Optional)" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-slate-900 font-bold uppercase tracking-[0.1em] text-xs py-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center mt-8">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity & Register"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={onVerify} className="space-y-6">
            <div>
              <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2 text-center">Enter Verification Code</label>
              <p className="text-white/50 text-xs text-center mb-6">A 6-digit code has been sent to your email.</p>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-white/40 transition-colors" 
                placeholder="------"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-slate-900 font-bold uppercase tracking-[0.1em] text-xs py-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Security Code"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
