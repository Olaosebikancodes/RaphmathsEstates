import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  ArrowLeft,
  Shield,
  Key,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, signUp, supabase } from "../lib/supabase";
import { cn } from "../utils/cn";
import { useToast } from "../context/ToastContext";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRequestCode = async () => {
    setRequestingCode(true);
    try {
      // Generate a random 8-character alphanumeric code
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error: insertError } = await supabase
        .from("admin_invites")
        .insert([{ code: newCode, is_used: false }]);

      if (insertError) throw insertError;

      // Email configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const adminEmail =
        import.meta.env.VITE_ADMIN_EMAIL || "princessojiribe@gmail.com";

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: adminEmail,
            message: `A new admin access code has been generated: ${newCode}`,
            code: newCode,
            app_name: "Raphmaths Estates",
          },
          publicKey,
        );

        showToast(`Code Sent! Please contact the main admin.`, "success");
      } else {
        // Log configuration error but don't show code
        throw new Error(
          "Email service is not configured. Please contact the main admin.",
        );
      }
    } catch (err) {
      showToast(
        err.message ||
          "Failed to generate or send code. Please try again later.",
        "error",
      );
    } finally {
      setRequestingCode(false);
    }
  };

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);

    if (pass.length < minLength)
      return "Password must be at least 8 characters long.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial)
      return "Password must contain at least one special character.";
    if (!hasUpper)
      return "Password must contain at least one uppercase letter.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/admin");
      } else {
        // Verify and use invitation code atomically via secure RPC
        const { data: invites, error: inviteError } = await supabase.rpc(
          "verify_and_use_admin_code",
          { input_code: inviteCode },
        );

        if (inviteError || !invites || invites.length === 0) {
          throw new Error(
            "Invalid or expired One-Time Code. Please contact the main admin.",
          );
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const strengthError = validatePassword(password);
        if (strengthError) throw new Error(strengthError);

        const { error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;

        showToast(
          "Account created successfully! You can now login.",
          "success",
        );
        setIsLogin(true);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/75 to-transparent" />

        {/* Brand logo */}
        <div className="relative z-10 px-12 pt-12 flex items-center gap-3">
          <div
            className="w-3 h-3 bg-primary-gold flex-shrink-0"
            style={{ transform: "rotate(45deg)" }}
          />
          <span className="font-playfair text-primary-gold text-xl font-semibold tracking-wide">
            Raphmaths Estates
          </span>
        </div>

        {/* Quote + stats */}
        <div className="relative z-10 px-12 pb-14">
          <p className="font-playfair italic text-text-primary/80 text-2xl leading-snug mb-10 max-w-xs">
            "The premier destination for luxury real estate in Anambra State."
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="label-caps text-text-secondary">500+</p>
              <p className="label-caps text-text-secondary opacity-60 mt-0.5">Properties</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="label-caps text-text-secondary">1,200+</p>
              <p className="label-caps text-text-secondary opacity-60 mt-0.5">Clients</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="label-caps text-text-secondary">15</p>
              <p className="label-caps text-text-secondary opacity-60 mt-0.5">Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-sm w-full mx-auto lg:mx-0"
        >
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-3 h-3 bg-primary-gold flex-shrink-0"
              style={{ transform: "rotate(45deg)" }}
            />
            <span className="font-playfair text-primary-gold text-lg font-semibold tracking-wide">
              Raphmaths Estates
            </span>
          </div>

          {/* Form header */}
          <div className="mb-10">
            <h1 className="font-playfair font-bold text-3xl text-text-primary mb-2">
              {isLogin ? "Admin Login" : "Create Account"}
            </h1>
            <p className="text-text-secondary text-sm">
              {isLogin
                ? "Welcome back, Agent."
                : "Join our elite team of experts."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="label-caps text-[10px] text-text-secondary">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@raphmathsestates.com"
                  className="w-full bg-background-surface border border-border pl-12 pr-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="label-caps text-[10px] text-text-secondary">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background-surface border border-border pl-12 pr-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors"
                />
              </div>
              {!isLogin && (
                <p className="text-[9px] text-text-secondary opacity-60">
                  Min 8 chars, 1 uppercase, 1 number, 1 special char.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="label-caps text-[10px] text-text-secondary">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background-surface border border-border pl-12 pr-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Invite Code */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="label-caps text-[10px] text-text-secondary">
                    One-Time Admin Code
                  </label>
                  <button
                    type="button"
                    disabled={requestingCode}
                    onClick={handleRequestCode}
                    className="text-[9px] font-bold text-primary-gold uppercase hover:underline disabled:opacity-50"
                  >
                    {requestingCode ? "Requesting..." : "Get Code"}
                  </button>
                </div>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter code from main admin"
                    className="w-full bg-background-surface border border-border pl-12 pr-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <p className="text-[9px] text-text-secondary opacity-60">
                  Contact princessojiribe@gmail.com for your access code.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register
                </>
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-8 pt-8 border-t border-border text-left">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-text-secondary hover:text-primary-gold transition-colors font-bold uppercase tracking-widest"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>

          {/* Back to site */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] text-text-secondary hover:text-text-primary transition-colors uppercase tracking-[0.2em] mt-6"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Site
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAuth;
