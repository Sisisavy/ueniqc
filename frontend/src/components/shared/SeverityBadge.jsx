import { cn } from "@/lib/utils";

const config = {
  critical: "bg-red-500/10 text-red-600 border-red-500/20",
  major: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  minor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export default function SeverityBadge({ severity }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wide",
      config[severity] || config.minor
    )}>
      {severity}
    </span>
  );
}