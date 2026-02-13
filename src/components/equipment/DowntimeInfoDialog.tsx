import React from "react";
import { DowntimeEvent } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onClose: () => void;
  downtime: DowntimeEvent | null;
  equipmentName: string;
}

export const DowntimeInfoDialog: React.FC<Props> = ({ open, onClose, downtime, equipmentName }) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Downtime Info — {equipmentName}</DialogTitle>
          <DialogDescription>Active downtime details for this machine</DialogDescription>
        </DialogHeader>
        {downtime ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <StatusBadge status={downtime.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Cause</p>
                <p className="font-medium capitalize">{downtime.cause.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Section</p>
                <p className="font-medium">{downtime.section}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reported By</p>
                <p className="font-medium">{downtime.reported_by}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Time</p>
                <p className="font-medium">{format(new Date(downtime.start_time), "MMM d, yyyy HH:mm")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{downtime.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            No active downtime found for this machine. The status may have been set manually.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
