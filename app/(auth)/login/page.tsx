"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Suspense } from "react";

const loginSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be valid")
    .max(15, "Phone number must be valid")
    .regex(/^\d{8,15}$/, "Phone number must contain only digits"),
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: "60",
      phoneNumber: "",
      pin: "",
    },
  });

  // Pre-fill phone number from URL query params if present
  useEffect(() => {
    // First, check for direct phone parameter in URL
    let phone = searchParams.get("phone");

    // If not found, check inside redirect URL
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

    // Auto-fill phone number if found
    if (phone && phone.length >= 10) {
      const countryCode = phone.slice(0, 2);
      const phoneNumber = phone.slice(2);

      form.setValue("countryCode", countryCode);
      form.setValue("phoneNumber", phoneNumber);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const phoneNumber = `${data.countryCode}${data.phoneNumber}`;

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
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="60">+60</SelectItem>
                        <SelectItem value="1">+1</SelectItem>
                        <SelectItem value="44">+44</SelectItem>
                        <SelectItem value="65">+65</SelectItem>
                        <SelectItem value="91">+91</SelectItem>
                        <SelectItem value="632">+632</SelectItem>
                        <SelectItem value="351">+351</SelectItem>
                        <SelectItem value="233">+233</SelectItem>
                        <SelectItem value="234">+234</SelectItem>
                        <SelectItem value="32">+32</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="123456789" {...field} maxLength={11} className="placeholder:text-muted-foreground/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormItem>

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
