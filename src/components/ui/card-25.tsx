import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stat {
  icon: React.ReactNode;
  label: string;
}

export interface AnimatedHikeCardProps {
  title: string;
  images: string[];
  stats: Stat[];
  description: string;
  onClick?: () => void;
  className?: string;
}

export const AnimatedHikeCard = React.forwardRef<
  HTMLDivElement,
  AnimatedHikeCardProps
>(({ title, images, stats, description, onClick, className }, ref) => {
  const [spread, setSpread] = React.useState(false);
  const isTouch = React.useRef(false);

  const handleMouseEnter = () => {
    if (!isTouch.current) setSpread(true);
  };
  const handleMouseLeave = () => {
    if (!isTouch.current) setSpread(false);
  };
  const handleClick = () => {
    if (isTouch.current) {
      if (!spread) {
        setSpread(true);
      } else {
        setSpread(false);
        onClick?.();
      }
    } else {
      onClick?.();
    }
  };

  return (
    <div
      ref={ref}
      onTouchStart={() => { isTouch.current = true; }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "relative block w-full cursor-pointer rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
        spread ? "-translate-y-1 shadow-lg" : "hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <ArrowRight
            className={cn(
              "h-5 w-5 transition-transform duration-300 ease-in-out",
              spread && "translate-x-1"
            )}
          />
        </div>

        <div className="relative mb-6 h-28">
          {images.map((src, index) => (
            <div
              key={index}
              className="absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out"
              style={{
                transform: spread
                  ? `translateX(${index * 120}px) rotate(${index * 8 - 4}deg)`
                  : `translateX(${index * 48}px)`,
                zIndex: images.length - index,
              }}
            >
              <img
                src={src}
                alt={`${title} ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
                }}
              />
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-1.5">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
});

AnimatedHikeCard.displayName = "AnimatedHikeCard";
