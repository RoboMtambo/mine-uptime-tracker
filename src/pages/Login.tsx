import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ROLE_LABELS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat } from "lucide-react";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [zpNumber, setZpNumber] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!zpNumber.trim()) return setError("Please enter your ZP or Voltron Number.");
    if (!role) return setError("Please select your role.");

    login(name.trim(), role as UserRole, zpNumber.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <HardHat className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">MineTrack</CardTitle>
          <CardDescription>Equipment Downtime Tracker — Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zpNumber">ZP / Voltron Number</Label>
              <Input
                id="zpNumber"
                type="password"
                placeholder="Enter your ZP or Voltron Number"
                value={zpNumber}
                onChange={(e) => setZpNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">This is your identification number used as your password</p>
            </div>

            <div className="space-y-2">
              <Label>Your Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
