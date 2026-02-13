import React, { useState } from "react";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { useEquipmentStore } from "@/hooks/useEquipmentStore";
import { useAuth } from "@/contexts/AuthContext";
import { DowntimeCause, CAUSE_LABELS } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  equipmentName: string;
  section: string;
  machineType: string;
}

export const ReportBreakdownDialog: React.FC<Props> = ({
  open, onClose, equipmentName, section, machineType,
}) => {
  const { user } = useAuth();
  const { addDowntime } = useDowntimeStore();
  const { setEquipmentDown } = useEquipmentStore();
  const [description, setDescription] = useState("");
  const [cause, setCause] = useState<DowntimeCause | "">("");

  const handleSubmit = () => {
    if (!description.trim() || !cause) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addDowntime({
      equipment_name: equipmentName,
      equipment_type: machineType,
      section,
      description: description.trim(),
      cause: cause as DowntimeCause,
      reported_by: user?.name || "Unknown",
    });
    setEquipmentDown(equipmentName);
    toast.success(`Breakdown reported for ${equipmentName}`);
    setDescription("");
    setCause("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Breakdown — {equipmentName}</DialogTitle>
          <DialogDescription>
            {machineType} • {section}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Cause Category *</Label>
            <Select value={cause} onValueChange={(v) => setCause(v as DowntimeCause)}>
              <SelectTrigger>
                <SelectValue placeholder="Select the cause" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CAUSE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the breakdown..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">Submit Report</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
