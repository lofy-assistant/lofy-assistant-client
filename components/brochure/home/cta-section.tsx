"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const whatsappNumber = "60178230685";
  const whatsappMessage = encodeURIComponent("Hey Lofy!");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative overflow-hidden bg-background text-center pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-foreground h-[50vh] flex items-center rounded-3xl mx-4 md:mx-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold leading-tight text-white">
                It's free to get started.
            </h2>

            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="px-10 py-6 text-xl text-secondary transition-all duration-300 bg-transparent hover:bg-transparent cursor-pointer ring-secondary ring-3 hover:ring-primary hover:text-primary rounded-xl hover:scale-105"
              >
                Try Lofy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
