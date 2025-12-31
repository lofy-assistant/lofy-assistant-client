"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AboutSettings() {
  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          About
        </CardTitle>
        <CardDescription>Application information and resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Version</h3>
          <p className="text-sm text-muted-foreground">1.0.0</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Resources</h3>
          <div className="space-y-2">
            <a
              href="/about-us"
              className="text-sm text-primary hover:underline block"
            >
              About Us
            </a>
            <a
              href="/features"
              className="text-sm text-primary hover:underline block"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="text-sm text-primary hover:underline block"
            >
              Pricing
            </a>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Legal</h3>
          <div className="space-y-2">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground block"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground block"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
