"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { PhoneNumberInput } from "@/components/phone-number-input";

type VerificationState = { userId: string; email: string };

const schema = z.object({
  dialCode: z.string().min(1, "Dial code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((v) => /^\d+$/.test(v), "Phone number must contain only digits"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

function ChangeEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [verification, setVerification] = useState<VerificationState | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dialCode: "60", phoneNumber: "", email: "" },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const phone = `${data.dialCode}${data.phoneNumber}`;
      const response = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email: data.email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update email.");
      setVerification({ userId: result.userId, email: result.email });
      setResendCooldown(60);
      toast.success("Verification code sent to your new email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verification) return;
    if (verifyCode.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: verification.userId, code: verifyCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed.");
      toast.success("Email verified! Welcome to Lofy.");
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!verification || resendCooldown > 0) return;
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: verification.userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to resend code.");
      setResendCooldown(60);
      toast.success("A new verification code has been sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  if (verification) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
        <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify your new email</CardTitle>
            <CardDescription className="text-center">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{verification.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <InputOTP maxLength={6} value={verifyCode} onChange={setVerifyCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={isVerifying || verifyCode.length < 6}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </div>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => { setVerification(null); setVerifyCode(""); }}
                className="text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Use a different email instead?
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
      <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Change your email</CardTitle>
          <CardDescription>
            Enter your phone number and the new email address you want to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PhoneNumberInput
                control={form.control}
                dialCodeName="dialCode"
                phoneNumberName="phoneNumber"
                label="Phone Number"
                phonePlaceholder="123456789"
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending code..." : "Update Email"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="underline hover:text-foreground transition-colors"
                >
                  Go back
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChangeEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
          <Card className="min-w-sm mx-auto shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Change your email</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <ChangeEmailForm />
    </Suspense>
  );
}
