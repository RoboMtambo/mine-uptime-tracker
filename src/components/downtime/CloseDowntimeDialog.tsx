import React, { useState } from "react";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { useEquipmentStore } from "@/hooks/useEquipmentStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  downtimeId: string;
}

export const CloseDowntimeDialog: React.FC<Props> = ({ open, onClose, downtimeId }) => {
  const { closeDowntime, downtimes } = useDowntimeStore();
  const { setEquipmentRunning } = useEquipmentStore();
  const [rootCause, setRootCause] = useState("");
  const [notes, setNotes] = useState("");

  const dt = downtimes.find((d) => d.id === downtimeId);

  const handleClose = () => {
    if (!rootCause.trim()) {
      toast.error("Please provide the root cause.");
      return;
    }
    closeDowntime(downtimeId, rootCause.trim(), notes.trim());
    if (dt) setEquipmentRunning(dt.equipment_name);
    toast.success("Downtime closed successfully.");
    setRootCause("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Downtime</DialogTitle>
          <DialogDescription>
            {dt ? `Closing downtime for ${dt.equipment_name}` : "Provide root cause and repair notes"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Root Cause *</Label>
            <Textarea
              placeholder="What was the root cause of the breakdown?"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Repair Notes</Label>
            <Textarea
              placeholder="Actions taken, parts used, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleClose} className="flex-1">Close Downtime</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
