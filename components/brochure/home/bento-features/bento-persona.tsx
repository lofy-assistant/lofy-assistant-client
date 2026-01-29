import { motion } from "motion/react";
import Image from "next/image";

export default function BentoPersona() {
  // Define 5 different AI personas as abstract orbs with emoji personalities
  const personas = [
    { id: 1, delay: 0, size: 70, y: 20, emoji: "💅", label: "Sassy" },
    { id: 2, delay: 0.2, size: 75, y: 0, emoji: "😈", label: "Mean" },
    { id: 3, delay: 0.4, size: 105, y: -10, emoji: "", label: "Neutral" },
    { id: 4, delay: 0.6, size: 75, y: 0, emoji: "😊", label: "Nice" },
    { id: 5, delay: 0.8, size: 70, y: 20, emoji: "🙄", label: "Sarcastic" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden sm:scale-100 scale-90">
      {/* Connecting lines between personas */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
        {personas.map((persona, i) => {
          if (i === personas.length - 1) return null;
          const x1 = `${20 + i * 15}%`;
          const x2 = `${20 + (i + 1) * 15}%`;
          return (
            <motion.line
              key={`line-${persona.id}`}
              x1={x1}
              y1="50%"
              x2={x2}
              y2="50%"
              stroke="url(#gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{
                duration: 1.5,
                delay: persona.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="[stop-color:rgb(52,211,153)]" />
            <stop offset="100%" className="[stop-color:rgb(129,140,248)]" />
          </linearGradient>
        </defs>
      </svg>

      {/* Persona orbs */}
      <div className="relative w-full h-full flex items-center justify-center gap-2 sm:gap-4">
        {personas.map((persona, index) => {
          const gradientStart = index / (personas.length - 1);
          // Hide the first and last persona on small screens (show on >=sm)
          const mobilePositionClass =
            persona.id === 1
              ? "hidden sm:flex sm:relative sm:left-auto sm:translate-x-0 sm:bottom-auto"
              : persona.id === 5
                ? "hidden sm:flex sm:relative sm:left-auto sm:translate-x-0 sm:bottom-auto"
                : "relative";

          return (
            <motion.div
              key={persona.id}
              className={`flex items-center justify-center transform-gpu sm:scale-100 scale-90 ${mobilePositionClass}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: persona.delay,
                ease: "easeOut",
              }}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: persona.size + 40,
                  height: persona.size + 40,
                  background: `radial-gradient(circle, ${gradientStart < 0.5 ? "rgba(52, 211, 153, 0.2)" : "rgba(129, 140, 248, 0.2)"} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  delay: persona.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main orb */}
              <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: persona.size,
                  height: persona.size,
                  background: `linear-gradient(135deg, 
                    rgb(${52 + gradientStart * 77}, ${211 - gradientStart * 71}, ${153 + gradientStart * 95}), 
                    rgb(${129 - gradientStart * 77}, ${140 + gradientStart * 71}, ${248 - gradientStart * 95}))`,
                  boxShadow: `0 0 ${persona.size / 2}px ${gradientStart < 0.5 ? "rgba(52, 211, 153, 0.4)" : "rgba(129, 140, 248, 0.4)"}`,
                }}
                animate={{
                  y: [persona.y, persona.y - 15, persona.y],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4 + index * 0.5,
                  delay: persona.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Inner sparkle effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: persona.delay + 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Emoji or Logo in the center */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  style={{
                    fontSize: persona.size * 0.5,
                    width: persona.id === 3 ? persona.size * 0.72 : "auto",
                    height: persona.id === 3 ? persona.size * 0.72 : "auto",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: persona.delay + 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {persona.id === 3 ? (
                    <Image
                      src="/assets/logo/lofy-logo-2.png"
                      alt="Lofy Logo"
                      width={persona.size * 0.72}
                      height={persona.size * 0.72}
                      className="object-contain"
                    />
                  ) : (
                    persona.emoji
                  )}
                </motion.div>

                {/* Particle dots inside orb */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: `${40 + i * 10}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        delay: persona.delay + i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Ambient particles floating around */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            background:
              i % 2 === 0 ? "rgb(52, 211, 153)" : "rgb(129, 140, 248)",
            opacity: 0.4,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(i) * 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.3,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
