"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForgotPinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Forgot Your PIN?</CardTitle>
          <CardDescription>PIN recovery feature is coming soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">We&apos;re working on a secure way to help you recover your PIN. In the meantime, please contact support for assistance.</p>

          <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/login")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
