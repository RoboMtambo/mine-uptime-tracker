import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEquipmentStore } from "@/hooks/useEquipmentStore";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { Cog, AlertTriangle, Clock, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(25, 95%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(0, 84%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(220, 70%, 50%)",
  "hsl(280, 65%, 60%)",
];

const Dashboard: React.FC = () => {
  const { equipment } = useEquipmentStore();
  const { downtimes } = useDowntimeStore();

  const totalEquipment = equipment.length;
  const currentlyDown = equipment.filter((e) => e.status === "down" || e.status === "under_repair").length;
  const activeDowntimes = downtimes.filter((d) => d.status !== "closed").length;
  const closedDowntimes = downtimes.filter((d) => d.status === "closed");

  const avgRepairHours =
    closedDowntimes.length > 0
      ? closedDowntimes.reduce((sum, d) => {
          if (d.end_time) {
            const diff = new Date(d.end_time).getTime() - new Date(d.start_time).getTime();
            return sum + diff / (1000 * 60 * 60);
          }
          return sum;
        }, 0) / closedDowntimes.length
      : 0;

  // Downtime by cause
  const causeCounts: Record<string, number> = {};
  downtimes.forEach((d) => {
    causeCounts[d.cause] = (causeCounts[d.cause] || 0) + 1;
  });
  const causeData = Object.entries(causeCounts).map(([cause, count]) => ({
    name: cause.charAt(0).toUpperCase() + cause.slice(1).replace("_", " "),
    value: count,
  }));

  // Monthly trends (last 6 months)
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en", { month: "short", year: "2-digit" });
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const count = downtimes.filter((dt) => {
      const t = new Date(dt.start_time);
      return t >= monthStart && t <= monthEnd;
    }).length;
    monthlyData.push({ month: label, count });
  }

  const stats = [
    { title: "Total Equipment", value: totalEquipment, icon: Cog, color: "text-primary" },
    { title: "Currently Down", value: currentlyDown, icon: AlertTriangle, color: "text-status-down" },
    { title: "Active Downtimes", value: activeDowntimes, icon: Activity, color: "text-status-repair" },
    { title: "Avg MTTR", value: `${avgRepairHours.toFixed(1)}h`, icon: Clock, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of equipment and downtime metrics</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Downtime Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.some((m) => m.count > 0) ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis allowDecimals={false} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-16">No downtime data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Downtime by Cause</CardTitle>
          </CardHeader>
          <CardContent>
            {causeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={causeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {causeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-16">No downtime data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
