"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DitherShader } from "@/components/ui/dither-shader";

export default function CTASection() {
  const whatsappNumber = "60178230685";
  const whatsappMessage = encodeURIComponent("Hey Lofy!");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative overflow-hidden bg-background text-center pb-24">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="relative overflow-hidden md:rounded-2xl border-y md:border border-neutral-800 shadow-2xl">
          <DitherShader
            src="https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            gridSize={2}
            ditherMode="bayer"
            colorMode="duotone"
            primaryColor="#1A237E"
            secondaryColor="#34d399"
            threshold={0.45}
            className="min-w-full h-[60vh]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div className="p-8 md:p-12 bg-black/30 backdrop-blur rounded-3xl border border-white/20 flex flex-col items-center gap-6">
              <h2 className="text-xl md:text-4xl font-medium leading-tight text-white drop-shadow-lg">
              AI assistance that feels human
            </h2>
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="px-5 py-3 md:px-10 md:py-6 text-base md:text-xl text-white transition-all duration-300 bg-transparent hover:bg-white/10 cursor-pointer ring-white ring-3 hover:ring-primary hover:text-primary rounded-xl hover:scale-105"
              >
                Try Lofy Now
              </Button>
            </Link>
              </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
