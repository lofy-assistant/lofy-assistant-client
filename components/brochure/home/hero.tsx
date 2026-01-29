"use client";

import Image from "next/image";
import { GrainyGradientBlob } from "@/components/ui/grainy-gradient-blob";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden min-h-svh bg-gradient-to-b from-neutral-900 via-stone-900 to-neutral-800">
      <GrainyGradientBlob
        size={800}
        colors={["#4338CA", "#0f766e", "#14b8a6"]}
        blur={180}
        className="absolute -bottom-48 -right-48 pointer-events-none"
      />
      <GrainyGradientBlob
        size={800}
        colors={["#4338CA", "#0f766e", "#14b8a6"]}
        blur={180}
        className="absolute -bottom-48 -left-48 pointer-events-none"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8 md:mt-20 mt-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-12">
          Introducing
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Lofy</span> AI Assistant
        </h1>

        {/* Phone mockup */}
        <div className="relative w-[321px] sm:w-[378px] md:w-[432px] mx-auto">
          {/* Phone frame */}
          <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
              <div className="w-20 h-1.5 bg-gray-800 rounded-full" />
              <div className="w-4 h-4 bg-gray-800 rounded-full" />
            </div>

            {/* Phone screen */}
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[660px] md:min-h-[748px]">
              {/* WhatsApp-style header */}
              <div className="bg-[#075E54] px-4 py-3 pt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="Lofy AI"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-base font-semibold text-white">
                    Lofy AI
                  </span>
                  <p className="text-xs text-emerald-200">online</p>
                </div>
              </div>

              {/* Chat background - WhatsApp style wallpaper */}
              <div
                className="bg-[#ECE5DD] min-h-[572px] md:min-h-[638px] p-3 relative"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c4be' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              >
                {/* Chat messages */}
                <div className="space-y-3">
                  {/* AI message */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow-sm relative">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Hey Mark, seems like your flight got delayed. Would you
                        like to reschedule today&apos;s meeting to 3pm instead?
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">
                          10:30 AM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 max-w-[80%] shadow-sm relative">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Thanks Lofy, but I got to pick up the kids so can you
                        change it to 4pm instead?
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">
                          10:32 AM
                        </span>
                        <svg
                          className="w-4 h-4 text-blue-500"
                          viewBox="0 0 16 15"
                          fill="currentColor"
                        >
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.89 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow-sm relative">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Alright, I have rescheduled today&apos;s meeting to 4pm
                        and have informed the participants through email 🍃
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">
                          10:33 AM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp-style input bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] px-2 py-2 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
                  <span className="text-sm text-gray-400">Type a message</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge below mockup */}
        <Badge variant="default" className="mt-8 px-4 py-2 bg-gradient-to-r from-emerald-400/10 to-indigo-400/10 border-emerald-400/30 text-white backdrop-blur-sm">
          ✨ AI Powered Productivity Tool
        </Badge>
      </div>
    </section>
  );
}
