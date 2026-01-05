"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parsePhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";
import { Suspense } from "react";
import { getCountriesWithMalaysiaFirst } from "@/lib/countries";

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  dialCode: z.string().min(1),
  phoneNumber: z
    .string()
    .min(1, "Please enter a phone number")
    .refine((value) => {
      // Only validate if we have a value
      if (!value) return false;
      return /^\d+$/.test(value);
    }, "Phone number must contain only digits"),
  question1: z.string().min(1, "Please answer question 1"),
  question2: z.string().min(1, "Please answer question 2"),
  question3: z.string().optional(),
  pin: z.string().length(6, "Please enter a 6-digit PIN"),
});

type FormData = z.infer<typeof formSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      dialCode: "60",
      phoneNumber: "",
      question1: "",
      question2: "",
      question3: "",
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

  const totalSteps = 3;

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 1) fieldsToValidate = ["name", "email", "phoneNumber"];
    if (currentStep === 2) fieldsToValidate = ["question1", "question2"];

    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      // Combine dial code + national number (e.g., "91" + "9789497050" = "919789497050")
      const fullPhoneNumber = `${formData.dialCode}${formData.phoneNumber}`;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, phone: fullPhoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success(data.isNewUser ? "Registration successful!" : "Profile completed successfully!");

      // Redirect to the original destination if present, otherwise to login
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4">
        <div className="min-h-screen flex items-center justify-center">
          <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
              <CardDescription className="text-center">
                Step {currentStep} of {totalSteps}
              </CardDescription>
              <div className="flex gap-2 mt-4">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className={`h-2 flex-1 rounded-full transition-all ${index + 1 <= currentStep ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={() => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <div className="flex items-start gap-2">
                              <FormField
                                control={form.control}
                                name="dialCode"
                                render={({ field }) => {
                                  const selectedCountry = allCountries.find((c) => c.dialCode === field.value);
                                  return (
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} onOpenChange={(open) => !open && setCountrySearch("")}>
                                      <FormControl>
                                        <SelectTrigger className="w-32">
                                          <SelectValue>{selectedCountry ? `${selectedCountry.flag} +${selectedCountry.dialCode}` : "+60"}</SelectValue>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="max-h-[300px]">
                                        <div className="px-2 py-2 sticky top-0 bg-background border-b">
                                          <Input placeholder="Search by name or code..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="h-8" onKeyDown={(e) => e.stopPropagation()} />
                                        </div>
                                        {filteredCountries.length > 0 ? (
                                          filteredCountries.map((country) => (
                                            <SelectItem key={country.dialCode} value={country.dialCode}>
                                              {country.flag} +{country.dialCode} {country.name}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">No countries found</div>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  );
                                }}
                              />
                              <div className="flex-1 space-y-1">
                                <FormField
                                  control={form.control}
                                  name="phoneNumber"
                                  render={({ field }) => (
                                    <FormControl>
                                      <Input type="tel" placeholder="123456789" {...field} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))} />
                                    </FormControl>
                                  )}
                                />
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Onboarding Questions */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                      <FormField
                        control={form.control}
                        name="question1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What is your professional background?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="full-time">Employed Full-Time</SelectItem>
                                <SelectItem value="part-time">Employed Part-Time</SelectItem>
                                <SelectItem value="self-employed">Self-employed</SelectItem>
                                <SelectItem value="neet">NEET</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="question2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Where did you know Lofy from?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="social-media">Social Media</SelectItem>
                                <SelectItem value="search-engine">Search Engine</SelectItem>
                                <SelectItem value="friend-colleague">Friend or Colleague</SelectItem>
                                <SelectItem value="online-advertisement">Online Advertisement</SelectItem>
                                <SelectItem value="article-blog">Article or Blog</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="question3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tell Lofy more about yourself. (optional)</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Share any additional information that would help us serve you better..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Create PIN */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in-50 duration-300">
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem>
                            <div className="text-center space-y-2">
                              <FormLabel className="text-lg">Create Your 6-Digit PIN</FormLabel>
                              <p className="text-sm text-muted-foreground">This PIN will be used to secure your account</p>
                            </div>
                            <FormControl>
                              <div className="flex justify-center">
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    {currentStep < totalSteps ? (
                      <Button type="button" onClick={handleNext} disabled={isLoading}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Complete Registration"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </form>
            </Form>
          </Card>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <AuroraBackground>
          <div className="min-h-screen flex items-center justify-center">
            <Card className="min-w-sm mx-auto shadow-xl rounded-xl p-4">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
                <CardDescription className="text-center">Loading...</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </AuroraBackground>
      }>
      <RegisterForm />
    </Suspense>
  );
}
