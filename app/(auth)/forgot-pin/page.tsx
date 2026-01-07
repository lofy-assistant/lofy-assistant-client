"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCountriesWithMalaysiaFirst } from "@/lib/countries";

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
  const [countrySearch, setCountrySearch] = useState("");
  const allCountries = getCountriesWithMalaysiaFirst();

  // Filter countries based on search (by name or dial code)
  const filteredCountries = countrySearch
    ? allCountries.filter((country) => {
        const searchLower = countrySearch.toLowerCase();
        return country.name.toLowerCase().includes(searchLower) || country.dialCode.includes(countrySearch);
      })
    : allCountries;

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
      // Combine dial code + national number (e.g., "60" + "123456789" = "60123456789")
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
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="dialCode"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {filteredCountries.map((country) => (
                            <SelectItem key={country.dialCode} value={country.dialCode}>
                              {country.flag} +{country.dialCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          {...field}
                          disabled={isLoading}
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
