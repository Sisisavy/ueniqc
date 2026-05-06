import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  passed: "#10b981", // Emerald
  failed: "#f43f5e", // Rose
  warning: "#f59e0b", // Amber
  pending: "#e2e8f0", // Slate
};

export default function ScoreChart({ tickets }) {
  const counts = {
    passed: tickets.filter(t => t.qc_status === "passed").length,
    failed: tickets.filter(t => t.qc_status === "failed").length,
    warning: tickets.filter(t => t.qc_status === "warning").length,
    pending: tickets.filter(t => t.qc_status === "pending").length,
  };

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}