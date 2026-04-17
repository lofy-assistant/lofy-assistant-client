"use client";

import { useEffect, useRef } from "react";

/** Same noise algorithm as `grainy-gradient-blob.tsx`: full-rect coverage, no blob shape */
const TILE = 256;

function fillTileCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const tile = document.createElement("canvas");
  tile.width = TILE;
  tile.height = TILE;
  const tctx = tile.getContext("2d");
  if (!tctx) return;

  const imageData = tctx.createImageData(TILE, TILE);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 25;
  }
  tctx.putImageData(imageData, 0, 0);

  ctx.clearRect(0, 0, width, height);
  for (let x = 0; x < width; x += TILE) {
    for (let y = 0; y < height; y += TILE) {
      ctx.drawImage(tile, x, y);
    }
  }
}

interface GrainOverlayProps {
  className?: string;
}

/**
 * Full-area film grain (canvas noise + mix-blend-overlay), matching `GrainyGradientBlob` grain layer.
 * Place inside a `relative` parent; use z-index below UI (e.g. z-10 vs content z-20).
 */
export function GrainOverlay({ className = "" }: GrainOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const w = Math.max(1, Math.floor(container.clientWidth));
      const h = Math.max(1, Math.floor(container.clientHeight));
      canvas.width = w;
      canvas.height = h;
      fillTileCanvas(ctx, w, h);
    };

    paint();
    const ro = new ResizeObserver(() => paint());
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full mix-blend-overlay opacity-50"
      />
    </div>
  );
}
