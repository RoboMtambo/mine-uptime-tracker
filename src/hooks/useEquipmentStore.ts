import { useState, useCallback } from "react";
import { Equipment, EquipmentStatus } from "@/types";

const STORAGE_KEY = "minetrack_equipment";

const DEFAULT_EQUIPMENT: Equipment[] = [
  { id: "1", name: "LHD 201", machine_type: "LHD", section: "Canaan", location: "Canaan", status: "running" },
  { id: "2", name: "LHD 202", machine_type: "LHD", section: "Eureka", location: "Eureka", status: "running" },
  { id: "3", name: "Drill Rig 101", machine_type: "Drill Rig", section: "Rockets", location: "Rockets", status: "down" },
  { id: "4", name: "Bolter 301", machine_type: "Bolter", section: "Canaan", location: "Canaan", status: "running" },
  { id: "5", name: "Truck 401", machine_type: "Truck", section: "Eureka", location: "Eureka", status: "idle" },
  { id: "6", name: "Grader 501", machine_type: "Grader", section: "Rockets", location: "Rockets", status: "under_repair" },
  { id: "7", name: "LHD 203", machine_type: "LHD", section: "Canaan", location: "Canaan", status: "running" },
  { id: "8", name: "Utility 601", machine_type: "Utility Vehicle", section: "Eureka", location: "Eureka", status: "running" },
];

function loadEquipment(): Equipment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_EQUIPMENT;
  } catch {
    return DEFAULT_EQUIPMENT;
  }
}

function saveEquipment(items: Equipment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useEquipmentStore = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(loadEquipment);

  const updateStatus = useCallback(
    (id: string, status: EquipmentStatus) => {
      const updated = equipment.map((e) => (e.id === id ? { ...e, status } : e));
      setEquipment(updated);
      saveEquipment(updated);
    },
    [equipment]
  );

  const setEquipmentDown = useCallback(
    (name: string) => {
      const updated = equipment.map((e) =>
        e.name.toLowerCase() === name.toLowerCase() ? { ...e, status: "down" as EquipmentStatus } : e
      );
      setEquipment(updated);
      saveEquipment(updated);
    },
    [equipment]
  );

  const setEquipmentRunning = useCallback(
    (name: string) => {
      const updated = equipment.map((e) =>
        e.name.toLowerCase() === name.toLowerCase() ? { ...e, status: "running" as EquipmentStatus } : e
      );
      setEquipment(updated);
      saveEquipment(updated);
    },
    [equipment]
  );

  return { equipment, updateStatus, setEquipmentDown, setEquipmentRunning };
};
