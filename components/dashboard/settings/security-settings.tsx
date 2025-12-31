"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SecuritySettings() {
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinData, setPinData] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleChangePIN = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pinData.newPin !== pinData.confirmPin) {
      toast.error("New PIN and confirmation do not match");
      return;
    }

    if (pinData.newPin.length < 4) {
      toast.error("PIN must be at least 4 characters");
      return;
    }

    setIsChangingPin(true);

    try {
      const response = await fetch("/api/user/pin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPin: pinData.currentPin,
          newPin: pinData.newPin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change PIN");
      }

      toast.success("PIN changed successfully!");
      setPinData({
        currentPin: "",
        newPin: "",
        confirmPin: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change PIN"
      );
      console.error(error);
    } finally {
      setIsChangingPin(false);
    }
  };

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Security
        </CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePIN} className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Change PIN</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPin">Current PIN</Label>
                <Input
                  id="currentPin"
                  type="password"
                  placeholder="Enter current PIN"
                  value={pinData.currentPin}
                  onChange={(e) =>
                    setPinData({ ...pinData, currentPin: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPin">New PIN</Label>
                <Input
                  id="newPin"
                  type="password"
                  placeholder="Enter new PIN"
                  value={pinData.newPin}
                  onChange={(e) =>
                    setPinData({ ...pinData, newPin: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirm New PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="Confirm new PIN"
                  value={pinData.confirmPin}
                  onChange={(e) =>
                    setPinData({ ...pinData, confirmPin: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          <Button type="submit" disabled={isChangingPin}>
            {isChangingPin && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Change PIN
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
