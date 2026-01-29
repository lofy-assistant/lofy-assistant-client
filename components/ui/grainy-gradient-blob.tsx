import { motion } from "motion/react";
import { CSSProperties, useEffect, useRef } from "react";

interface GrainyGradientBlobProps {
  size?: number;
  colors?: string[];
  blur?: number;
  className?: string;
  animated?: boolean;
}

export function GrainyGradientBlob({
  size = 400,
  colors = ["#8B5CF6", "#EC4899", "#F59E0B"],
  blur = 60,
  className = "",
  animated = true,
}: GrainyGradientBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate grain texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = size;
    const height = size;
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 25; // Low opacity for subtle grain
    }

    ctx.putImageData(imageData, 0, 0);
  }, [size]);

  const gradientStyle: CSSProperties = {
    background: `radial-gradient(circle at 30% 50%, ${colors[0]}, ${colors[1]} 50%, ${colors[2]})`,
    filter: `blur(${blur}px)`,
  };

  const blobContent = (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Gradient blob */}
      <div
        className="absolute inset-0 rounded-full opacity-80"
        style={gradientStyle}
      />
      
      {/* Grain overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-full mix-blend-overlay opacity-50"
        style={{ width: size, height: size }}
      />
    </div>
  );

  if (!animated) {
    return <div className={className}>{blobContent}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 10, -10, 0],
        x: [0, 20, -20, 0],
        y: [0, -20, 20, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {blobContent}
    </motion.div>
  );
}
