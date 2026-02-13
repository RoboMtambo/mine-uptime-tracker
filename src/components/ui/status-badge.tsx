import { cn } from "@/lib/utils";
import { EquipmentStatus, DowntimeStatus } from "@/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-status-running/15 text-status-running border-status-running/30" },
  down: { label: "Down", className: "bg-status-down/15 text-status-down border-status-down/30" },
  under_repair: { label: "Under Repair", className: "bg-status-repair/15 text-status-repair border-status-repair/30" },
  idle: { label: "Idle", className: "bg-status-idle/15 text-status-idle border-status-idle/30" },
  open: { label: "Open", className: "bg-status-down/15 text-status-down border-status-down/30" },
  in_progress: { label: "In Progress", className: "bg-status-repair/15 text-status-repair border-status-repair/30" },
  closed: { label: "Closed", className: "bg-status-running/15 text-status-running border-status-running/30" },
};

interface StatusBadgeProps {
  status: EquipmentStatus | DowntimeStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
};
