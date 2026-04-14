import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AboutSettings() {
  return (
    <Card className="py-4 text-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="w-5 h-5" />
          About
        </CardTitle>
        <CardDescription className="text-xs">Application information and resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="text-sm font-medium mb-1">Version</h3>
          <p className="text-sm text-muted-foreground">2.0.2</p>
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
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground block"
            >
              Terms of Service
            </a>
            <a
              href="/privacy-policy"
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
