import { useState, useCallback } from "react";
import { DowntimeEvent, DowntimeCause, DowntimeStatus } from "@/types";

const STORAGE_KEY = "minetrack_downtimes";

function loadDowntimes(): DowntimeEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDowntimes(events: DowntimeEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export const useDowntimeStore = () => {
  const [downtimes, setDowntimes] = useState<DowntimeEvent[]>(loadDowntimes);

  const addDowntime = useCallback(
    (data: {
      equipment_name: string;
      equipment_type: string;
      section: string;
      description: string;
      cause: DowntimeCause;
      reported_by: string;
    }) => {
      const newEvent: DowntimeEvent = {
        id: crypto.randomUUID(),
        equipment_id: data.equipment_name.toLowerCase().replace(/\s+/g, "-"),
        equipment_name: data.equipment_name,
        equipment_type: data.equipment_type,
        reported_by: data.reported_by,
        start_time: new Date().toISOString(),
        description: data.description,
        cause: data.cause,
        section: data.section,
        status: "open",
        created_at: new Date().toISOString(),
      };
      const updated = [newEvent, ...downtimes];
      setDowntimes(updated);
      saveDowntimes(updated);
      return newEvent;
    },
    [downtimes]
  );

  const startRepair = useCallback(
    (id: string) => {
      const updated = downtimes.map((d) =>
        d.id === id ? { ...d, status: "in_progress" as DowntimeStatus } : d
      );
      setDowntimes(updated);
      saveDowntimes(updated);
    },
    [downtimes]
  );

  const closeDowntime = useCallback(
    (id: string, rootCause: string, repairNotes: string) => {
      const updated = downtimes.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "closed" as DowntimeStatus,
              end_time: new Date().toISOString(),
              root_cause: rootCause,
              repair_notes: repairNotes,
            }
          : d
      );
      setDowntimes(updated);
      saveDowntimes(updated);
    },
    [downtimes]
  );

  const getActiveDowntimes = useCallback(() => {
    return downtimes.filter((d) => d.status !== "closed");
  }, [downtimes]);

  const getDowntimeForEquipment = useCallback(
    (equipmentName: string) => {
      return downtimes.find(
        (d) =>
          d.equipment_name.toLowerCase() === equipmentName.toLowerCase() &&
          d.status !== "closed"
      );
    },
    [downtimes]
  );

  return {
    downtimes,
    addDowntime,
    startRepair,
    closeDowntime,
    getActiveDowntimes,
    getDowntimeForEquipment,
  };
};
