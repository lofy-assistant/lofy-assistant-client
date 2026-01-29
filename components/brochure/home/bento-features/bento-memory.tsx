import { useMemo } from "react";
import { motion } from "motion/react";
import { Brain, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BentoMemory() {
  const isMobile = useIsMobile();
  
  // Generate random positions once
  const particles = useMemo(() => {
    return [...Array(12)].map(() => ({
      initialX: (() => {
        const r = Math.random();
        return r * 100;
      })(),
      initialY: (() => {
        const r = Math.random();
        return r * 100;
      })(),
      targetX: (() => {
        const r = Math.random();
        return r * 100;
      })(),
      targetY: (() => {
        const r = Math.random();
        return r * 100;
      })(),
      duration: (() => {
        const r = Math.random();
        return r * 4 + 3;
      })(),
      delay: (() => {
        const r = Math.random();
        return r * 2;
      })(),
    }));
  }, []);

  const dataStreams = useMemo(() => {
    return [...Array(5)].map((_, i) => ({
      delay: i * 0.3,
      duration: 2 + i * 0.2, // Use deterministic, stable duration
    }));
  }, []);

  return (
    <div className="relative w-full h-full sm:aspect-3/1 aspect-2/1 overflow-hidden flex items-center justify-center">
      {/* Floating particles - hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className={
                i > 6
                  ? "absolute hidden sm:block w-1.5 h-1.5 bg-emerald-400/40 rounded-full"
                  : "absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full"
              }
              initial={{
                x: particle.initialX + "%",
                y: particle.initialY + "%",
              }}
              animate={{
                x: [
                  particle.initialX + "%",
                  particle.targetX + "%",
                  particle.initialX + "%",
                ],
                y: [
                  particle.initialY + "%",
                  particle.targetY + "%",
                  particle.initialY + "%",
                ],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Main visual - Brain with data streams */}
      <div className="relative flex items-center gap-8">
        {/* Left side - Data sources */}
        <div className="flex flex-col gap-3">
          {dataStreams.map((stream, i) => (
            <motion.div
              key={`source-${i}`}
              className="relative"
              animate={isMobile ? { opacity: 0.7 } : {
                opacity: [0.4, 1, 0.4],
              }}
              transition={isMobile ? { duration: 0 } : {
                duration: 2,
                repeat: Infinity,
                delay: stream.delay,
              }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Data streams flowing to brain */}
        <div className="absolute left-8 right-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {dataStreams.map((stream, i) => (
            <div key={`stream-${i}`} className="relative h-0.5 w-full">
              <motion.div
                className="absolute h-full bg-gradient-to-r from-emerald-400 to-indigo-500"
                initial={{ width: isMobile ? "100%" : "0%", left: "0%" }}
                animate={isMobile ? { width: "100%", left: "0%" } : {
                  width: ["0%", "100%", "0%"],
                  left: ["0%", "0%", "100%"],
                }}
                transition={isMobile ? { duration: 0 } : {
                  duration: stream.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: stream.delay,
                }}
              />
              {/* Glowing dots moving along stream - hidden on mobile */}
              {!isMobile && (
                <motion.div
                  className="absolute w-2 h-2 bg-emerald-300 rounded-full shadow-lg shadow-emerald-400/50 -top-0.75"
                  initial={{ left: "0%" }}
                  animate={{
                    left: ["0%", "100%"],
                  }}
                  transition={{
                    duration: stream.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: stream.delay,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Center - Brain icon */}
        <motion.div
          className="relative z-10"
          animate={isMobile ? { scale: 1 } : {
            scale: [1, 1.05, 1],
          }}
          transition={isMobile ? { duration: 0 } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Rotating ring - static on mobile */}
          <motion.div
            className="absolute inset-0 -m-4"
            animate={isMobile ? { rotate: 0 } : {
              rotate: 360,
            }}
            transition={isMobile ? { duration: 0 } : {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full border-2 border-dashed border-emerald-400/30 rounded-full" />
          </motion.div>

          {/* Pulsing rings - hidden on mobile */}
          {!isMobile && [0, 0.5, 1].map((delay) => (
            <motion.div
              key={delay}
              className="absolute inset-0 border-2 border-indigo-400/40 rounded-full"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: delay,
              }}
            />
          ))}

          <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-emerald-500 via-teal-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <Brain
              className="w-6 sm:w-8 h-6 sm:h-8 text-white"
              strokeWidth={1.5}
            />

            {/* Energy sparks - hidden on mobile */}
            {!isMobile && [0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 2) * 30,
                  y: Math.sin((i * Math.PI) / 2) * 30,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.2,
                }}
              >
                <Zap className="w-3 h-3 text-emerald-300" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Memory storage visualization */}
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`memory-${i}`}
              className="flex gap-1"
              initial={{ opacity: isMobile ? 1 : 0, x: isMobile ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={isMobile ? { duration: 0 } : {
                duration: 0.5,
                delay: i * 0.3 + 1,
              }}
            >
              {[...Array(3)].map((_, j) => (
                <motion.div
                  key={j}
                  className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded"
                  initial={{ scale: isMobile ? 1 : 0 }}
                  animate={isMobile ? { scale: 1, opacity: 0.85 } : {
                    scale: [0, 1, 1],
                    opacity: [0, 1, 0.7],
                  }}
                  transition={isMobile ? { duration: 0 } : {
                    duration: 0.8,
                    delay: i * 0.3 + j * 0.1 + 1.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background ambient glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-indigo-500/5 blur-3xl"
        animate={isMobile ? { opacity: 0.45 } : {
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={isMobile ? { duration: 0 } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
