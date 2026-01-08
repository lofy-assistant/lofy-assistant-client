"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parsePhoneNumber } from "libphonenumber-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Suspense } from "react";
import { getCountriesWithMalaysiaFirst } from "@/lib/countries";
import { PhoneNumberInput } from "@/components/phone-number-input";

const loginSchema = z.object({
  dialCode: z.string().min(1, "Dial code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => /^\d+$/.test(value), "Phone number must contain only digits"),
  pin: z
    .string()
    .min(6, "PIN must be 6 digits")
    .max(6, "PIN must be 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const allCountries = getCountriesWithMalaysiaFirst();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      dialCode: "60",
      phoneNumber: "",
      pin: "",
    },
  });

  // Pre-fill phone number from URL query params if present
  useEffect(() => {
    let phone = searchParams.get("phone");

    if (!phone) {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        try {
          const redirectUrl = new URL(redirect, window.location.origin);
          phone = redirectUrl.searchParams.get("phone");
        } catch (error) {
          console.error("Error parsing redirect URL:", error);
        }
      }
    }

    if (phone && phone.length >= 10) {
      try {
        // Phone parameter never has +, so add it for parsing
        const parsedPhone = parsePhoneNumber(`+${phone}`);

        if (parsedPhone && parsedPhone.country) {
          // Find the country by its code to get the dial code
          const country = allCountries.find((c) => c.code === parsedPhone.country);
          if (country) {
            form.setValue("dialCode", country.dialCode);
            form.setValue("phoneNumber", parsedPhone.nationalNumber);
          }
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
      }
    }
  }, [searchParams, form, allCountries]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Combine dial code + national number (e.g., "91" + "9789497050" = "919789497050")
      const phoneNumber = `${data.dialCode}${data.phoneNumber}`;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          pin: data.pin,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const cookies = document.cookie.split(";");
        const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("session="));
        const token = sessionCookie ? sessionCookie.split("=")[1] : null;

        toast.success("Login successful!");
        console.log("🔐 Session Token:", token);
        console.log("👤 User Data:", result.user);
        console.log("✅ Login Successful");

        const redirect = searchParams.get("redirect");
        router.push(redirect || "/dashboard");
      } else {
        toast.error(result.error || "Login failed");
        console.error("Login Error:", result.error);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Network Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Enter your phone number and PIN to sign in</CardDescription>
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
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6-Digit PIN</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup className="gap-1">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex flex-col gap-2 mt-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/register")}>
                Create Account
              </Button>
              <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => router.push("/forgot-pin")}>
                Forgot PIN?
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <Card className="min-w-sm mx-auto shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
