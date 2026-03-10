"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PhoneNumberInput } from "@/components/phone-number-input";

const forgotPinSchema = z.object({
  dialCode: z.string().min(1, "Dial code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => /^\d+$/.test(value), "Phone number must contain only digits"),
});

type ForgotPinFormValues = z.infer<typeof forgotPinSchema>;

export default function ForgotPinPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPinFormValues>({
    resolver: zodResolver(forgotPinSchema),
    defaultValues: {
      dialCode: "60",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: ForgotPinFormValues) => {
    setIsLoading(true);
    try {
      const phoneNumber = `${data.dialCode}${data.phoneNumber}`;

      const response = await fetch("/api/auth/forgot-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reset link");
      }

      toast.success("PIN reset link sent to your WhatsApp!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Forgot Your PIN?</CardTitle>
          <CardDescription>Enter your phone number to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PhoneNumberInput
                control={form.control}
                dialCodeName="dialCode"
                phoneNumberName="phoneNumber"
                label="Phone Number"
                phonePlaceholder="123456789"
                disabled={isLoading}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
