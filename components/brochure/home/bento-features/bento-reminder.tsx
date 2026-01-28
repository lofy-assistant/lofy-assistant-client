import { Bell, Infinity } from "lucide-react";
import { motion } from "motion/react";

export function BentoReminder() {
  // Positions for the floating bells
  const bellPositions = [
    { x: "15%", y: "20%", delay: 0 },
    { x: "75%", y: "30%", delay: 0.5 },
    { x: "40%", y: "55%", delay: 1 },
    { x: "20%", y: "75%", delay: 1.5 },
    { x: "80%", y: "70%", delay: 2 },
    { x: "55%", y: "25%", delay: 2.5 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-white rounded-2xl flex items-center justify-center p-2 sm:p-0">
      {/* Floating bell notifications */}
      {bellPositions.map((pos, index) => (
        <motion.div
          key={index}
          className={index > 2 ? "absolute hidden sm:block" : "absolute"}
          style={{ left: pos.x, top: pos.y }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.8],
            y: [20, 0, 0, -10],
          }}
          transition={{
            duration: 3,
            delay: pos.delay,
            repeat: 999999,
            repeatDelay: 2.5,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -15, 15, -15, 0],
            }}
            transition={{
              duration: 0.5,
              delay: pos.delay + 0.5,
              repeat: 999999,
              repeatDelay: 5,
            }}
          >
            <div className="bg-linear-to-br from-emerald-400/60 to-indigo-400/60 rounded-full p-2">
              <Bell
                className="text-white"
                size={18 + index * 2}
                fill="currentColor"
                fillOpacity={0.5}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Central infinity symbol with gradient */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div>
          <svg
            viewBox="0 0 100 100"
            className="drop-shadow-lg w-20 h-20 sm:w-24 sm:h-24"
          >
            <defs>
              <linearGradient
                id="infinityGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <Infinity
              className="text-emerald-500"
              size={80}
              strokeWidth={2}
              style={{ stroke: "url(#infinityGradient)" }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Pulsing ring effect with gradient */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <svg className="absolute w-40 h-40 sm:w-48 sm:h-48">
          <defs>
            <linearGradient
              id="ringGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            stroke="url(#ringGradient1)"
            strokeWidth="2"
            animate={{
              scale: [1, 1.4, 1.4, 1],
              opacity: [0.5, 0.2, 0.2, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: 999999,
              ease: "easeInOut",
            }}
          />
        </svg>

        <svg className="absolute w-40 h-40 sm:w-48 sm:h-48">
          <defs>
            <linearGradient
              id="ringGradient2"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            stroke="url(#ringGradient2)"
            strokeWidth="2"
            animate={{
              scale: [1, 1.6, 1.6, 1],
              opacity: [0.4, 0.1, 0.1, 0.4],
            }}
            transition={{
              duration: 4,
              delay: 0.5,
              repeat: 999999,
              ease: "easeInOut",
            }}
          />
        </svg>

        <svg className="absolute w-40 h-40 sm:w-48 sm:h-48">
          <defs>
            <linearGradient
              id="ringGradient3"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
              <stop offset="65%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            stroke="url(#ringGradient3)"
            strokeWidth="2"
            animate={{
              scale: [1, 1.8, 1.8, 1],
              opacity: [0.3, 0.05, 0.05, 0.3],
            }}
            transition={{
              duration: 4,
              delay: 1,
              repeat: 999999,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Additional animated bell in corner */}
      <motion.div
        className="absolute bottom-6 left-6 hidden sm:block"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: 999999,
          repeatDelay: 2,
        }}
      >
        <div className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-indigo-500 rounded-full p-2">
          <Bell
            className="text-white"
            size={28}
            fill="currentColor"
            fillOpacity={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}
