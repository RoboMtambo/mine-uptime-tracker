import React, { useState } from "react";
import { useEquipmentStore } from "@/hooks/useEquipmentStore";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReportBreakdownDialog } from "@/components/equipment/ReportBreakdownDialog";
import { DowntimeInfoDialog } from "@/components/equipment/DowntimeInfoDialog";
import { AlertTriangle, Info, Search } from "lucide-react";

const Equipment: React.FC = () => {
  const { equipment } = useEquipmentStore();
  const { getDowntimeForEquipment } = useDowntimeStore();
  const [search, setSearch] = useState("");
  const [breakdownTarget, setBreakdownTarget] = useState<{ name: string; section: string; type: string } | null>(null);
  const [infoTarget, setInfoTarget] = useState<string | null>(null);

  const filtered = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.section.toLowerCase().includes(search.toLowerCase()) ||
      e.machine_type.toLowerCase().includes(search.toLowerCase())
  );

  const infoDowntime = infoTarget ? getDowntimeForEquipment(infoTarget) : undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">Monitor all registered mining equipment</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((eq) => {
          const isDown = eq.status === "down" || eq.status === "under_repair";
          return (
            <Card key={eq.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{eq.name}</h3>
                    <p className="text-sm text-muted-foreground">{eq.machine_type}</p>
                  </div>
                  <StatusBadge status={eq.status} />
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Section: <span className="text-foreground">{eq.section}</span></p>
                  {eq.serial_number && <p>S/N: {eq.serial_number}</p>}
                </div>
                <div className="flex gap-2">
                  {!isDown && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setBreakdownTarget({
                          name: eq.name,
                          section: eq.section,
                          type: eq.machine_type,
                        })
                      }
                    >
                      <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                      Report Breakdown
                    </Button>
                  )}
                  {isDown && (
                    <Button size="sm" variant="outline" onClick={() => setInfoTarget(eq.name)}>
                      <Info className="mr-1 h-3.5 w-3.5" />
                      View Downtime Info
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No equipment found matching your search.</p>
      )}

      {/* Report Breakdown Dialog */}
      <ReportBreakdownDialog
        open={!!breakdownTarget}
        onClose={() => setBreakdownTarget(null)}
        equipmentName={breakdownTarget?.name || ""}
        section={breakdownTarget?.section || ""}
        machineType={breakdownTarget?.type || ""}
      />

      {/* Downtime Info Dialog */}
      <DowntimeInfoDialog
        open={!!infoTarget}
        onClose={() => setInfoTarget(null)}
        downtime={infoDowntime || null}
        equipmentName={infoTarget || ""}
      />
    </div>
  );
};

export default Equipment;
