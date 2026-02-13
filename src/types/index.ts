export type UserRole =
  | "operator"
  | "team_leader"
  | "supervisor"
  | "maintenance"
  | "engineer"
  | "overseer_miner"
  | "shift_boss"
  | "mine_captain"
  | "mine_manager"
  | "admin";

export const ROLE_LABELS: Record<UserRole, string> = {
  operator: "Operator",
  team_leader: "Team Leader",
  supervisor: "Supervisor",
  maintenance: "Maintenance Team",
  engineer: "Engineer",
  overseer_miner: "Overseer Miner",
  shift_boss: "Shift Boss",
  mine_captain: "Mine Captain",
  mine_manager: "Mine Manager",
  admin: "Admin",
};

export type EquipmentStatus = "running" | "down" | "under_repair" | "idle";

export interface Equipment {
  id: string;
  name: string;
  machine_type: string;
  section: string;
  location: string;
  status: EquipmentStatus;
  serial_number?: string;
  installation_date?: string;
  last_maintenance?: string;
}

export type DowntimeCause =
  | "mechanical"
  | "electrical"
  | "hydraulic"
  | "structural"
  | "operator_error"
  | "scheduled"
  | "other";

export const CAUSE_LABELS: Record<DowntimeCause, string> = {
  mechanical: "Mechanical",
  electrical: "Electrical",
  hydraulic: "Hydraulic",
  structural: "Structural",
  operator_error: "Operator Error",
  scheduled: "Scheduled Maintenance",
  other: "Other",
};

export type DowntimeStatus = "open" | "in_progress" | "closed";

export interface DowntimeEvent {
  id: string;
  equipment_id: string;
  equipment_name: string;
  equipment_type: string;
  reported_by: string;
  start_time: string;
  end_time?: string;
  description: string;
  cause: DowntimeCause;
  section: string;
  status: DowntimeStatus;
  root_cause?: string;
  repair_notes?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_equipment: number;
  currently_down: number;
  total_downtimes: number;
  week_downtimes: number;
  mttr_hours: number;
  week_mttr_hours: number;
  downtime_by_cause: { cause: string; count: number }[];
  monthly_trends: { month: string; count: number }[];
}
