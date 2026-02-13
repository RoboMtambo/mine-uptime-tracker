import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface RoleAccess {
  canViewDashboard: boolean;
  canViewEquipment: boolean;
  canReportDowntime: boolean;
  canViewDowntimes: boolean;
  canStartRepair: boolean;
  canCloseDowntime: boolean;
  canManageEquipment: boolean;
  canManageUsers: boolean;
}

const ACCESS_MAP: Record<UserRole, RoleAccess> = {
  operator: {
    canViewDashboard: false,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: false,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: false,
    canManageUsers: false,
  },
  team_leader: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: false,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: false,
    canManageUsers: false,
  },
  supervisor: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: false,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: false,
    canManageUsers: false,
  },
  maintenance: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: true,
    canCloseDowntime: true,
    canManageEquipment: false,
    canManageUsers: false,
  },
  engineer: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: true,
    canCloseDowntime: true,
    canManageEquipment: false,
    canManageUsers: false,
  },
  overseer_miner: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: false,
    canManageUsers: false,
  },
  shift_boss: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: false,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: false,
    canManageUsers: false,
  },
  mine_captain: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: true,
    canManageUsers: false,
  },
  mine_manager: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: false,
    canCloseDowntime: false,
    canManageEquipment: true,
    canManageUsers: true,
  },
  admin: {
    canViewDashboard: true,
    canViewEquipment: true,
    canReportDowntime: true,
    canViewDowntimes: true,
    canStartRepair: true,
    canCloseDowntime: true,
    canManageEquipment: true,
    canManageUsers: true,
  },
};

export const useRoleAccess = (): RoleAccess => {
  const { user } = useAuth();
  if (!user) {
    return {
      canViewDashboard: false,
      canViewEquipment: false,
      canReportDowntime: false,
      canViewDowntimes: false,
      canStartRepair: false,
      canCloseDowntime: false,
      canManageEquipment: false,
      canManageUsers: false,
    };
  }
  return ACCESS_MAP[user.role];
};
