import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-status-success" />,
    error: <AlertCircle className="w-5 h-5 text-status-error" />,
    info: <Info className="w-5 h-5 text-primary-gold" />,
  };

  const bgColors = {
    success: "bg-status-success/10 border-status-success/20",
    error: "bg-status-error/10 border-status-error/20",
    info: "bg-primary-gold/10 border-primary-gold/20",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-sm border shadow-2xl min-w-[300px] max-w-md backdrop-blur-md",
              bgColors[toast.type] || bgColors.info
            )}
          >
            <div className="flex-shrink-0">
              {icons[toast.type] || icons.info}
            </div>
            <p className="flex-grow text-xs font-bold uppercase tracking-widest text-text-primary leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
