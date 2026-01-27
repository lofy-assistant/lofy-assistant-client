import { motion } from "motion/react";
import { Calendar, Zap } from "lucide-react";
import Image from "next/image";

export function BentoSmartCalendar() {
  return (
    <div className="flex items-center justify-center h-full px-4">
      {/* First Icon - Calendar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0, duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg w-12 h-12 border border-gray-100 flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-emerald-500 to-indigo-600 p-2 rounded-lg">
          <Calendar className="size-4 text-white" />
        </div>
      </motion.div>

      {/* Arrow to Triangle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mx-4"
      >
        <svg
          width="80"
          height="60"
          viewBox="0 0 80 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0 30 Q 40 25, 80 30"
            stroke="url(#gradient-0)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M 80 30 L 70 25 M 80 30 L 70 35"
            stroke="url(#gradient-0)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
        </svg>
      </motion.div>

      {/* Triangle Formation - Gmail, Outlook, Apple Mail */}
      <div className="relative mr-4">
        {/* Top Icon - Gmail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 15, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 30, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg w-12 h-12 border border-gray-100 flex items-center justify-center mb-2"
        >
          <Image
            src="/images/bento-features/gmail-icon.svg"
            alt="Gmail"
            width={48}
            height={48}
          />
        </motion.div>

        {/* Bottom Left - Outlook */}
        <div className="flex gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20, y: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg w-12 h-12 border border-gray-100 flex items-center justify-center"
          >
            <Image
              src="/images/bento-features/outlook-icon.svg"
              alt="Outlook"
              width={48}
              height={48}
            />
          </motion.div>

          {/* Bottom Right - Apple Mail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg w-12 h-12 border border-gray-100 flex items-center justify-center"
          >
            <Image
              src="/images/bento-features/apple-mail-icon.svg"
              alt="Apple Mail"
              width={64}
              height={64}
            />
          </motion.div>
        </div>
      </div>

      {/* Arrow to Last Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="mx-4"
      >
        <svg
          width="80"
          height="60"
          viewBox="0 0 80 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0 30 Q 40 25, 80 30"
            stroke="url(#gradient-1)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M 80 30 L 70 25 M 80 30 L 70 35"
            stroke="url(#gradient-1)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.3 }}
          />
        </svg>
      </motion.div>

      {/* Last Icon - Zap */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg w-12 h-12 border border-gray-100 flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-emerald-500 to-indigo-600 p-2 rounded-lg">
          <Zap className="size-4 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
