export default function StatCard({ label, value, icon: Icon, variant = "default" }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}