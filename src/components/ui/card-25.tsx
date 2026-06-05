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
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "group relative block w-full cursor-pointer rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </div>

        {/* Images — transform driven entirely by CSS vars so hover classes win */}
        <div className="relative mb-6 h-28">
          {images.map((src, index) => (
            <div
              key={index}
              className="absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out [transform:translateX(var(--ix))] group-hover:[transform:translateX(var(--hx))_rotate(var(--hr))]"
              style={{
                "--ix": `${index * 48}px`,
                "--hx": `${index * 120}px`,
                "--hr": `${index * 8 - 4}deg`,
                zIndex: images.length - index,
              } as React.CSSProperties}
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
