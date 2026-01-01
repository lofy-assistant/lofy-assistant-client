"use client";

import Link from "next/link";
import AppNavBar from "@/components/app-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BentoFeatures } from "@/components/brochure/bento-features";
import Testimonials from "@/components/brochure/testimonials";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />

      <section className="relative flex overflow-hidden h-svh">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute rounded-full top-10 left-1/10 w-96 h-96 bg-linear-to-r from-purple-400/30 to-teal-400/30 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full top-40 left-1/4 w-96 h-96 bg-linear-to-r from-violet-400/30 to-indigo-400/30 blur-3xl animate-pulse "></div>
          <div className="absolute rounded-full bottom-1/4 left-1/10 w-96 h-96 bg-linear-to-r from-green-400/30 to-fuchsia-400/30 blur-3xl animate-pulse "></div>
        </div>

        <div className="max-w-7xl mx-auto flex-1 grid grid-rows-1 grid-cols-1 h-[calc(100vh-6rem)]">
          <div className="relative z-10 self-center px-4 justify-self-start sm:px-6 md:px-8">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="px-4 py-2 transition-all duration-300 border border-white shadow-lg bg-linear-to-r from-emerald-400/30 to-indigo-500/40 backdrop-blur-md hover:scale-105"
              >
                <span className="text-xs text-transparent bg-linear-to-r from-emerald-800 to-indigo-800 bg-clip-text">
                  ✨ AI-Powered Productivity Application
                </span>
              </Badge>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight text-transparent lg:text-8xl bg-linear-to-r from-emerald-700/80 via-indigo-700/80 to-emerald-700 bg-clip-text">
                  Lofy ;
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-gray-800 lg:text-xl ">
                  Meet your new right hand man.
                  <br /> An Agentic AI Personal Assistant that get things done.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-10 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg transition-all duration-300 shadow-lg text-secondary bg-linear-to-r from-emerald-600/80 to-indigo-600/80 hover:shadow-xl hover:scale-105"
                >
                  🤖 Try Lofy Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="link"
                  size="lg"
                  className="px-8 py-6 text-lg transition-all duration-300 hover:scale-105 text-muted-foreground"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Free To Use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                <span>No Apps Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container px-8 mx-auto">
          <div className="mb-20 text-center">
            <Badge
              variant="secondary"
              className="mb-6 text-blue-700 bg-blue-100 border-blue-200 hover:bg-blue-100"
            >
              <span>💡</span>
              <span>Powerful Features</span>
            </Badge>
            <h2 className="mb-6 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
              Your Personal Assistant AI Agent
            </h2>
            <p className="max-w-4xl mx-auto leading-relaxed text-gray-600 text-md lg:text-lg">
              Lofy is an agentic AI personal assistant that integrates
              seamlessly into your workflow, understanding context and
              automating tasks to boost your productivity with intelligent
              automation.
            </p>
          </div>
          <BentoFeatures />
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="relative py-24 overflow-hidden bg-white">
        <div className="container px-8 mx-auto">
          <div className="mb-20 text-center">
            <Badge
              variant="secondary"
              className="mb-6 text-purple-700 bg-purple-100 border-purple-200 hover:bg-purple-100"
            >
              <span>🚀</span>
              <span>Simple Process</span>
            </Badge>
            <h2 className="mb-6 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
              How Lofy Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              Simple integration, powerful results. Get started in minutes and
              see immediate productivity gains with our intelligent automation
              system.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-linear-to-r from-blue-200 via-purple-200 to-green-200"></div>

            <div className="relative grid gap-8 md:grid-cols-4">
              <div className="relative group">
                <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-lg font-bold text-white transition-transform duration-300 transform -translate-x-1/2 rounded-full shadow-lg -top-4 left-1/2 bg-linear-to-br from-blue-500 to-blue-600 group-hover:scale-110">
                  1
                </div>
                <Card className="p-6 pt-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Connect
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Link your email, calendar, and productivity tools in
                      seconds with secure OAuth integration
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-lg font-bold text-white transition-transform duration-300 transform -translate-x-1/2 rounded-full shadow-lg -top-4 left-1/2 bg-linear-to-br from-purple-500 to-purple-600 group-hover:scale-110">
                  2
                </div>
                <Card className="p-6 pt-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Learn
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Lofy analyzes your patterns and preferences automatically
                      to understand your workflow
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-lg font-bold text-white transition-transform duration-300 transform -translate-x-1/2 rounded-full shadow-lg -top-4 left-1/2 bg-linear-to-br from-orange-500 to-orange-600 group-hover:scale-110">
                  3
                </div>
                <Card className="p-6 pt-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Act
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-gray-600">
                      AI takes action on your behalf, handling routine tasks and
                      automating your workflow
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-lg font-bold text-white transition-transform duration-300 transform -translate-x-1/2 rounded-full shadow-lg -top-4 left-1/2 bg-linear-to-br from-green-500 to-green-600 group-hover:scale-110">
                  4
                </div>
                <Card className="p-6 pt-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-green-500 to-green-600 rounded-2xl">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Thrive
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Focus on what matters while Lofy handles the rest,
                      boosting your productivity exponentially
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Testimonials Section */}
      <section className="relative py-24 overflow-hidden bg-accent">
        <WavyBackground className="max-w-7xl mx-auto pb-40">
          <Testimonials />
        </WavyBackground>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 overflow-hidden bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container px-8 mx-auto">
          <div className="mb-20 text-center">
            <Badge
              variant="secondary"
              className="mb-6 text-green-700 bg-green-100 border-green-200 hover:bg-green-100"
            >
              <span>💎</span>
              <span>Why Choose Lofy</span>
            </Badge>
            <h2 className="mb-6 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
              Transform Your Productivity
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              Join thousands of professionals who have transformed their
              productivity with AI assistance. Experience the future of work
              today.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-green-500 to-green-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    Save 10+ Hours Weekly
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    Automate email management, scheduling, and routine tasks to
                    reclaim your time for high-value work and strategic
                    thinking.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-red-500 to-red-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zm0 10h8l-2.586 2.586a2 2 0 01-2.828 0L4.828 17z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    Never Miss Important
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    AI-powered prioritization ensures urgent matters get your
                    attention while filtering out noise and distractions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    Work-Life Balance
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    Reduce stress and overwhelm by letting AI handle the
                    administrative burden of modern work life.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    Enterprise Security
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    Bank-grade encryption and compliance ensure your data stays
                    private and secure at all times.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    Seamless Integration
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    Works with your existing tools - no disruption to your
                    current workflow or established habits.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shrink-0 group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="mb-3 text-xl font-bold text-gray-900">
                    24/7 Availability
                  </CardTitle>
                  <p className="leading-relaxed text-gray-600">
                    Your AI assistant never sleeps, handling tasks around the
                    clock so you can focus on strategy and innovation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute top-0 rounded-full left-1/4 w-72 h-72 bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 delay-1000 rounded-full right-1/4 w-96 h-96 bg-white/5 blur-3xl animate-pulse"></div>

        <div className="container relative z-10 px-8 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-white bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/20"
              >
                <span>🚀</span>
                <span>Ready to Get Started?</span>
              </Badge>
              <h2 className="text-5xl font-bold leading-tight text-white md:text-6xl">
                Ready to Transform Your
                <span className="block text-transparent bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text">
                  Productivity?
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl leading-relaxed text-blue-100 md:text-2xl">
                Join the productivity revolution. Start your free trial today
                and experience the power of AI assistance that works seamlessly
                in your inbox.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold text-blue-600 transition-all duration-300 bg-white shadow-2xl hover:bg-gray-50 hover:shadow-3xl hover:scale-105"
                >
                  🚀 Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-12 py-8 text-xl font-semibold text-white transition-all duration-300 border-2 border-white shadow-lg hover:bg-white hover:text-blue-600 hover:shadow-xl hover:scale-105"
              >
                📺 Watch Demo
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 text-blue-100 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
            <div className="pt-8">
              <p className="text-sm text-blue-200">
                Trusted by 10,000+ professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
