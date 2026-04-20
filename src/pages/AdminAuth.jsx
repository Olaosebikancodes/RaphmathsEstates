import React, { useState } from "react";
import { motion } from "framer-motion";
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

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRequestCode = async () => {
    setRequestingCode(true);
    setError(null);
    try {
      // Generate a random 8-character alphanumeric code
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error: insertError } = await supabase
        .from("admin_invites")
        .insert([{ code: newCode, is_used: false }]);

      if (insertError) throw insertError;

      // In a real app, this would trigger an email via Supabase Edge Functions or a Webhook.
      // Since I can't set up an email provider for you, we simulate it here.
      console.log(
        `Code ${newCode} generated and "sent" to olaosebikani345@gmail.com`,
      );
      alert(
        `Code Generated: ${newCode}\n\nNote: In a real scenario, this code would be sent to olaosebikani345@gmail.com. Since we are in development, please use the code above to register.`,
      );
    } catch (err) {
      const errorMsg = err.message || "Unknown error occurred";
      setError(
        `Failed to generate code: ${errorMsg}\n\nTip: Ensure the 'admin_invites' table exists and RLS allows public inserts.`,
      );
      console.error(err);
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
    setError(null);

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

        alert("Verification email sent! Please check your inbox.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
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

        {error && (
          <div className="mb-6 p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-bold rounded-sm">
            {error}
          </div>
        )}

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
