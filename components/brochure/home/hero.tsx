"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const whatsappNumber = "60178230685";
  const whatsappMessage = encodeURIComponent("hey lofy!");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
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
                Meet your new right hand bot.
                <br /> An Agentic AI Personal Assistant that get things done.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-10 sm:flex-row">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="px-8 py-6 text-lg transition-all duration-300 shadow-lg text-secondary bg-linear-to-r from-emerald-600/80 to-indigo-600/80 hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                Try Lofy Now
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
  );
}
