import { cn } from "../../lib/util.js";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Sparkles } from "lucide-react";

const config = {
  passed: { icon: CheckCircle2, label: "Passed", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  failed: { icon: XCircle, label: "Failed", className: "bg-rose-500/10 text-rose-700 border-rose-500/20" },
  warning: { icon: AlertTriangle, label: "Warning", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  pending: { icon: Clock, label: "Pending", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default function QCStatusBadge({ status, size = "sm" }) {
  const { icon: Icon, label, className } = config[status] || config.pending;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
      className
    )}>
      {status === "passed" && <Sparkles className="w-3 h-3" />}
      {label}
    </span>
  );
}