import React from "react";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseDowntimeDialog } from "@/components/downtime/CloseDowntimeDialog";
import { format } from "date-fns";
import { Play, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Downtimes: React.FC = () => {
  const { downtimes, startRepair } = useDowntimeStore();
  const { canStartRepair, canCloseDowntime } = useRoleAccess();
  const [closeTarget, setCloseTarget] = useState<string | null>(null);

  const handleStartRepair = (id: string) => {
    startRepair(id);
    toast.success("Repair started.");
  };

  const activeDowntimes = downtimes.filter((d) => d.status !== "closed");
  const closedDowntimes = downtimes.filter((d) => d.status === "closed");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Downtimes</h1>
        <p className="text-muted-foreground">Manage and track all equipment downtime events</p>
      </div>

      {/* Active downtimes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Active ({activeDowntimes.length})</h2>
        {activeDowntimes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No active downtimes — all equipment is operational.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeDowntimes.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{d.equipment_name}</h3>
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{d.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Cause: {d.cause}</span>
                        <span>Section: {d.section}</span>
                        <span>Reported by: {d.reported_by}</span>
                        <span>Started: {format(new Date(d.start_time), "MMM d, HH:mm")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {d.status === "open" && canStartRepair && (
                        <Button size="sm" onClick={() => handleStartRepair(d.id)}>
                          <Play className="mr-1 h-3.5 w-3.5" />
                          Start Repair
                        </Button>
                      )}
                      {d.status === "in_progress" && canCloseDowntime && (
                        <Button size="sm" variant="outline" onClick={() => setCloseTarget(d.id)}>
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          Close Downtime
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Closed downtimes */}
      {closedDowntimes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Closed ({closedDowntimes.length})</h2>
          <div className="space-y-3">
            {closedDowntimes.map((d) => (
              <Card key={d.id} className="opacity-75">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{d.equipment_name}</h3>
                    <StatusBadge status="closed" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{d.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Cause: {d.cause}</span>
                    <span>Root Cause: {d.root_cause || "N/A"}</span>
                    <span>Closed: {d.end_time ? format(new Date(d.end_time), "MMM d, HH:mm") : "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Close Downtime Dialog */}
      <CloseDowntimeDialog
        open={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        downtimeId={closeTarget || ""}
      />
    </div>
  );
};

export default Downtimes;
