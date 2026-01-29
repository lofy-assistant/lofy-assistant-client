import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <div className={cn("group/bento row-span-1 relative h-full", className)}>
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      >
        <div className="border h-full rounded-xl overflow-hidden">
          <div className="relative bg-white flex h-full flex-col justify-between gap-4 p-4 md:p-6 dark:bg-neutral-950 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              {header && (
                <div className="w-full h-48 overflow-hidden rounded-lg">
                  {header}
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-sans text-lg font-semibold text-balance text-black md:text-xl dark:text-white">
                  {title}
                </h3>
                <p className="font-sans text-sm text-justify md:text-left text-black md:text-base dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlowingEffect>
    </div>
  );
};
