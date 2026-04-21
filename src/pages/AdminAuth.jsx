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
        import.meta.env.VITE_ADMIN_EMAIL || "olaosebikani345@gmail.com";

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
        // Fallback if EmailJS is not configured
        showToast(
          `Code Generated: ${newCode}. Please contact main admin.`,
          "success",
        );
      }
    } catch (err) {
      showToast(err.message || "Failed to generate or send code", "error");
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
        // Verify Invitation Code
        const { data: invite, error: inviteError } = await supabase
          .from("admin_invites")
          .select("*")
          .eq("code", inviteCode)
          .eq("is_used", false)
          .single();

        if (inviteError || !invite) {
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

        // Mark code as used
        await supabase
          .from("admin_invites")
          .update({ is_used: true })
          .eq("id", invite.id);

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
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-background-surface border border-border p-8 md:p-12 rounded-sm shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-gold/10 flex items-center justify-center rounded-full mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-gold" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-text-primary mb-2">
            {isLogin ? "Admin Login" : "Create Account"}
          </h1>
          <p className="text-text-secondary text-sm">
            {isLogin
              ? "Welcome back, Agent."
              : "Join our elite team of experts."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                className="w-full bg-background border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
              />
            </div>
          </div>

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
                className="w-full bg-background border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
              />
            </div>
            {!isLogin && (
              <p className="text-[9px] text-text-secondary opacity-60">
                Min 8 chars, 1 uppercase, 1 number, 1 special char.
              </p>
            )}
          </div>

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
                  className="w-full bg-background border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
              </div>
            </div>
          )}

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
                  className="w-full bg-background border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
              </div>
              <p className="text-[9px] text-text-secondary opacity-60">
                Contact olaosebikani345@gmail.com for your access code.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
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

        <div className="mt-8 pt-8 border-t border-border text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-text-secondary hover:text-primary-gold transition-colors font-bold uppercase tracking-widest"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-secondary hover:text-text-primary transition-colors uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Site
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
