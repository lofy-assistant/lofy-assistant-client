import { motion } from "motion/react";
import Image from "next/image";

interface Node {
  id: number;
  x: number;
  y: number;
  iconSrc: string;
  alt: string;
}

export default function BentoIntegration() {
  // Center node at exact center
  const centerX = 50;
  const centerY = 50;

  // Left side nodes (3 icons, evenly distributed vertically) - WhatsApp, Slack, Telegram
  const leftNodes: Node[] = [
    { id: 1, x: 15, y: 20, iconSrc: "/assets/bento-features/whatsapp-icon.svg", alt: "WhatsApp" },
    { id: 2, x: 15, y: 50, iconSrc: "/assets/bento-features/slack-icon.svg", alt: "Slack" },
    { id: 3, x: 15, y: 80, iconSrc: "/assets/bento-features/telegram-icon.svg", alt: "Telegram" },
  ];

  // Right side nodes (3 icons, evenly distributed vertically) - Outlook, Calendar, Gmail
  const rightNodes: Node[] = [
    { id: 4, x: 85, y: 20, iconSrc: "/assets/bento-features/outlook-icon.svg", alt: "Outlook" },
    { id: 5, x: 85, y: 50, iconSrc: "/assets/bento-features/google-calendar-icon.svg", alt: "Google Calendar" },
    { id: 6, x: 85, y: 80, iconSrc: "/assets/bento-features/gmail-icon.svg", alt: "Gmail" },
  ];

  const sideNodes = [...leftNodes, ...rightNodes];

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden">
      {/* SVG for connection lines - positioned behind everything */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="integrationLineGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(129, 140, 248)" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Lines from each side node to center */}
        {sideNodes.map((node, index) => (
          <motion.path
            key={`line-${node.id}`}
            d={`M ${node.x} ${node.y} L ${centerX} ${centerY}`}
            stroke="url(#integrationLineGradient)"
            strokeWidth="0.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              pathLength: {
                duration: 1.5,
                delay: index * 0.1,
                ease: "easeInOut",
              },
              opacity: {
                duration: 4,
                delay: index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </svg>

      {/* Side Nodes */}
      {sideNodes.map((node, index) => {
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              zIndex: 2,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: 1,
            }}
            transition={{
              scale: {
                duration: 5,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: { duration: 1, delay: index * 0.15 },
            }}>
            <div className="relative w-11 h-11 rounded-full flex items-center justify-center">
              <Image
                src={node.iconSrc}
                alt={node.alt}
                width={24}
                height={24}
                className="w-11 h-11"
              />
            </div>
          </motion.div>
        );
      })}

      {/* Center Node (Larger) */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 bg-linear-to-tr from-emerald-400/50 to-indigo-400/50 backdrop-blur-lg border-4 border-white/30 dark:border-gray-800/50 rounded-full p-1"
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
          zIndex: 3,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: { duration: 1, delay: 0.3 },
        }}>
        <div className="relative w-17 h-17 rounded-full flex items-center justify-center">
          <Image
            src="/assets/logo/logo.png"
            alt="Lofy Logo"
            width={68}
            height={68}
            className="w-17 h-17"
          />
        </div>

        {/* Pulse ring effect for center */}
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-violet-500"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1.6, 2.2, 2.4],
            opacity: [0, 0.5, 0.4, 0.15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.1, 0.4, 0.8, 1],
          }}
        />
      </motion.div>
    </div>
  );
}
