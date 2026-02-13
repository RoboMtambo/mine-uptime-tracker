import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDowntimeStore } from "@/hooks/useDowntimeStore";
import { useEquipmentStore } from "@/hooks/useEquipmentStore";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { DowntimeCause, CAUSE_LABELS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface ReportDowntimeProps {
  prefillName?: string;
  prefillSection?: string;
  prefillType?: string;
  onSuccess?: () => void;
}

const ReportDowntime: React.FC<ReportDowntimeProps> = ({
  prefillName = "",
  prefillSection = "",
  prefillType = "",
  onSuccess,
}) => {
  const { user } = useAuth();
  const { addDowntime } = useDowntimeStore();
  const { setEquipmentDown } = useEquipmentStore();
  const { canViewDowntimes } = useRoleAccess();
  const navigate = useNavigate();

  const [machineName, setMachineName] = useState(prefillName);
  const [machineType, setMachineType] = useState(prefillType);
  const [section, setSection] = useState(prefillSection);
  const [description, setDescription] = useState("");
  const [cause, setCause] = useState<DowntimeCause | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName.trim() || !description.trim() || !cause) {
      toast.error("Please fill in all required fields.");
      return;
    }

    addDowntime({
      equipment_name: machineName.trim(),
      equipment_type: machineType.trim() || "Unknown",
      section: section.trim() || "Unknown",
      description: description.trim(),
      cause: cause as DowntimeCause,
      reported_by: user?.name || "Unknown",
    });

    setEquipmentDown(machineName.trim());
    toast.success(`Downtime reported for ${machineName}`);

    if (onSuccess) {
      onSuccess();
    } else {
      navigate(canViewDowntimes ? "/downtimes" : "/equipment");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Report Equipment Downtime</CardTitle>
        </div>
        <CardDescription>Fill out the details of the equipment breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="machineName">Machine Name & Number *</Label>
              <Input
                id="machineName"
                placeholder="e.g. LHD 201"
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machineType">Machine Type</Label>
              <Input
                id="machineType"
                placeholder="e.g. LHD, Drill Rig, Truck"
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Location / Section</Label>
            <Input
              id="section"
              placeholder="e.g. Canaan, Eureka, Rockets"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cause">Cause Category *</Label>
            <Select value={cause} onValueChange={(v) => setCause(v as DowntimeCause)}>
              <SelectTrigger>
                <SelectValue placeholder="Select the cause" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CAUSE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the breakdown in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              Submit Report
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportDowntime;
