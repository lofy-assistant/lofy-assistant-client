"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parsePhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";
import { Suspense } from "react";
import { getCountriesWithMalaysiaFirst } from "@/lib/countries";
import { PhoneNumberInput } from "@/components/phone-number-input";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/ui/searchable-select"

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
  question1: z.string().min(1, "Please answer the question"),
  question2: z.string().min(1, "Please answer the question"),
  question3: z.string().optional(),
  question4: z.string().min(1, "Please answer the question"),
  pin: z.string().length(6, "Please enter a 6-digit PIN"),
});

const profession: SearchableSelectOption[] = [
  { value: "software-engineer", label: "Software Engineer" },
  { value: "data-scientist-ml-engineer", label: "Data Scientist / Machine Learning Engineer" },
  { value: "devops-platform-engineer", label: "DevOps / Platform Engineer" },
  { value: "cloud-architect", label: "Cloud Architect" },
  { value: "cybersecurity-specialist", label: "Cybersecurity Specialist" },
  { value: "qa-engineer-tester", label: "QA Engineer / Tester" },
  { value: "it-support-sysadmin", label: "IT Support / Systems Administrator" },
  { value: "hardware-electronics-engineer", label: "Hardware / Electronics Engineer" },
  { value: "engineering-discipline-engineer", label: "Civil / Mechanical / Electrical Engineer" },
  { value: "architect-built-environment", label: "Architect (Built Environment)" },

  { value: "product-manager", label: "Product Manager" },
  { value: "project-program-manager", label: "Project / Program Manager" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "operations-manager", label: "Operations Manager" },
  { value: "consultant", label: "Consultant" },
  { value: "entrepreneur-founder", label: "Entrepreneur / Founder" },

  { value: "marketing-professional", label: "Marketing Professional" },
  { value: "sales-professional", label: "Sales Professional" },
  { value: "customer-success-support", label: "Customer Success / Customer Support" },
  { value: "social-media-digital-marketing-manager", label: "Social Media / Digital Marketing Manager" },

  { value: "accountant-auditor", label: "Accountant / Auditor" },
  { value: "financial-analyst-investment-professional", label: "Financial Analyst / Investment Professional" },
  { value: "lawyer-legal-professional", label: "Lawyer / Legal Professional" },
  { value: "compliance-risk-officer", label: "Compliance / Risk Officer" },

  { value: "doctor-physician", label: "Doctor / Physician" },
  { value: "nurse-clinical-healthcare", label: "Nurse / Clinical Healthcare Staff" },
  { value: "pharmacist-dentist-allied-health", label: "Pharmacist / Dentist / Allied Health Professional" },
  { value: "psychologist-therapist-counselor", label: "Psychologist / Therapist / Counselor" },
  { value: "medical-researcher", label: "Medical Researcher" },

  { value: "teacher-lecturer-professor", label: "Teacher / Lecturer / Professor" },
  { value: "research-scientist-academic", label: "Research Scientist / Academic Researcher" },

  { value: "designer-creative", label: "Designer (Graphic / UX/UI / Creative)" },
  { value: "content-creator-media", label: "Content Creator (Writer / Journalist / Media Producer)" },

  { value: "technician-skilled-trades", label: "Technician / Skilled Trades Worker" },
  { value: "construction-site-worker", label: "Construction / Engineering Site Worker" },
  { value: "manufacturing-production-worker", label: "Manufacturing / Production Worker" },
  { value: "logistics-transportation-worker", label: "Logistics / Transportation Worker" },
  { value: "service-hospitality-retail-worker", label: "Service Industry / Hospitality / Retail Worker" },

  { value: "government-public-ngo-worker", label: "Government / Public Sector / NGO Worker" },
  { value: "student-intern-job-seeker", label: "Student / Intern / Job Seeker" },
];

type FormData = z.infer<typeof formSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const allCountries = getCountriesWithMalaysiaFirst();

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
      question4: "",
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
          const country = allCountries.find(
            (c) => c.code === parsedPhone.country
          );
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
    if (currentStep === 2) fieldsToValidate = ["question1", "question2", "question4"];

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

      toast.success(
        data.isNewUser
          ? "Registration successful!"
          : "Profile completed successfully!"
      );

      // Redirect to the original destination if present, otherwise to dashboard
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
      <Card className="min-w-sm shadow-xl rounded-xl p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Step {currentStep} of {totalSteps}
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
              />
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
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <PhoneNumberInput
                    control={form.control}
                    dialCodeName="dialCode"
                    phoneNumberName="phoneNumber"
                    label="Phone Number"
                    phonePlaceholder="123456789"
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
                        <FormLabel>
                          What is your professional background?
                        </FormLabel>
                        <SearchableSelect
                          options={profession}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select a profession..."
                          searchPlaceholder="Search professions..."
                          emptyMessage="No profession found."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="question4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is your age group?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an age group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-12">0-12</SelectItem>
                            <SelectItem value="13-18">13-18</SelectItem>
                            <SelectItem value="19-25">19-25</SelectItem>
                            <SelectItem value="26-35">26-35</SelectItem>
                            <SelectItem value="36-45">36-45</SelectItem>
                            <SelectItem value="46-55">46-55</SelectItem>
                            <SelectItem value="56-65">56-65</SelectItem>
                            <SelectItem value="66+">66+</SelectItem>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="social-media">
                              Social Media
                            </SelectItem>
                            <SelectItem value="search-engine">
                              Search Engine
                            </SelectItem>
                            <SelectItem value="friend-colleague">
                              Friend or Colleague
                            </SelectItem>
                            <SelectItem value="online-advertisement">
                              Online Advertisement
                            </SelectItem>
                            <SelectItem value="article-blog">
                              Article or Blog
                            </SelectItem>
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
                        <FormLabel>
                          Tell Lofy more about yourself. (optional)
                        </FormLabel>
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
                          <FormLabel className="text-lg">
                            Create Your 6-Digit PIN
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This PIN will be used to secure your account
                          </p>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
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

              {/* Login Link */}
              <div className="text-center pt-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
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
                <CardTitle className="text-2xl font-bold text-center">
                  Complete Your Profile
                </CardTitle>
                <CardDescription className="text-center">
                  Loading...
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </AuroraBackground>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
