"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  countryCode: z.string().min(1),
  phoneNumber: z.string().min(8, "Please enter a valid phone number"),
  question1: z.string().min(1, "Please answer question 1"),
  question2: z.string().min(1, "Please answer question 2"),
  question3: z.string().optional(),
  pin: z.string().length(6, "Please enter a 6-digit PIN"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "60",
      phoneNumber: "",
      question1: "",
      question2: "",
      question3: "",
      pin: "",
    },
  });

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
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;

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
      router.push("/login");
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
                                name="countryCode"
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
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
                                      <SelectItem value="32">+32</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
