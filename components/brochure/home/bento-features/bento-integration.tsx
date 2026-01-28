import { motion } from "motion/react";
import { Zap, Database, Cloud, Cpu, Share2, Globe, Layers } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  icon: React.ComponentType<{ className?: string }>;
}

export default function BentoIntegration() {
  // Center node at exact center
  const centerX = 50;
  const centerY = 50;

  // Left side nodes (3 icons, evenly distributed vertically)
  const leftNodes: Node[] = [
    { id: 1, x: 15, y: 20, icon: Zap },
    { id: 2, x: 15, y: 50, icon: Database },
    { id: 3, x: 15, y: 80, icon: Cloud },
  ];

  // Right side nodes (3 icons, evenly distributed vertically)
  const rightNodes: Node[] = [
    { id: 4, x: 85, y: 20, icon: Cpu },
    { id: 5, x: 85, y: 50, icon: Share2 },
    { id: 6, x: 85, y: 80, icon: Globe },
  ];

  const sideNodes = [...leftNodes, ...rightNodes];

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden">
      {/* SVG for connection lines - positioned behind everything */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="integrationLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
        const Icon = node.icon;
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
            <div
              className="relative w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgb(52, 211, 153), rgb(139, 92, 246), rgb(129, 140, 248))",
                boxShadow: "0 0 12px rgba(139, 92, 246, 0.5)",
              }}>
              <Icon className="w-4 h-4 text-white" />
            </div>

            {/* Pulse ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-violet-500"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{
                scale: [1, 1.8],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 3,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>
        );
      })}

      {/* Center Node (Larger) */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
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
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgb(52, 211, 153), rgb(139, 92, 246), rgb(129, 140, 248))",
            boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)",
          }}>
          <Layers className="w-7 h-7 text-white" />
        </div>

        {/* Pulse ring effect for center */}
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-violet-500"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{
            scale: [1, 2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
}
