import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhotoStackItem {
  src: string;
  name: string;
}

export interface InteractivePhotoStackProps {
  items: PhotoStackItem[];
  title: React.ReactNode;
  icon?: React.ReactNode;
  onViewAll?: () => void;
  className?: string;
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateNonOverlappingTransforms = (items: PhotoStackItem[]) => {
  const positions: { x: number; y: number; r: number }[] = [];
  const displayed = items.slice(0, 5);
  const cardW = 25;
  const cardH = 45;

  displayed.forEach(() => {
    let newPos = { x: 0, y: 0, r: 0 };
    let collision = false;
    let retries = 0;
    do {
      collision = false;
      newPos = { x: random(-45, 45), y: random(-25, 25), r: random(-25, 25) };
      for (const pos of positions) {
        if (Math.abs(newPos.x - pos.x) < cardW && Math.abs(newPos.y - pos.y) < cardH) {
          collision = true;
          break;
        }
      }
      retries++;
    } while (collision && retries < 100);
    positions.push(newPos);
  });

  return positions.map(
    (p) => `translate(${p.x}vw, ${p.y}vh) rotate(${p.r}deg)`,
  );
};

const InteractivePhotoStack = React.forwardRef<
  HTMLDivElement,
  InteractivePhotoStackProps
>(({ items, title, icon, onViewAll, className, ...props }, ref) => {
  const [topCardIndex, setTopCardIndex] = React.useState(0);
  const [isGroupHovered, setIsGroupHovered] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);
  const [spreadTransforms, setSpreadTransforms] = React.useState<string[]>([]);

  const displayed = items.slice(0, 5);
  const baseRotations = ["rotate-2", "-rotate-2", "rotate-4", "-rotate-4", "rotate-6"];

  const handleMouseEnter = () => {
    setSpreadTransforms(generateNonOverlappingTransforms(items));
    setIsGroupHovered(true);
  };

  const handleCardClick = (index: number) => {
    if (isGroupHovered) {
      setClickedIndex(index);
      setTimeout(() => {
        setIsGroupHovered(false);
        setTopCardIndex(index);
        setClickedIndex(null);
      }, 700);
    } else {
      setTopCardIndex(index);
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center gap-6", className)}
      {...props}
    >
      {icon && (
        <div className="text-muted-foreground">{icon}</div>
      )}

      <div
        className="relative h-80 w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !clickedIndex && setIsGroupHovered(false)}
      >
        <div className="relative left-1/2 top-1/2 h-64 w-52 -translate-x-1/2 -translate-y-1/2">
          {displayed.map((item, index) => {
            const numItems = displayed.length;
            let stackPosition = index - topCardIndex;
            if (stackPosition < 0) stackPosition += numItems;
            const isTopCard = index === topCardIndex;
            const isClicked = index === clickedIndex;
            const transform = isGroupHovered
              ? spreadTransforms[index]
              : `translateY(${stackPosition * 0.5}rem) scale(${1 - stackPosition * 0.05})`;

            return (
              <div
                key={item.name + index}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "absolute inset-0 h-64 w-52 cursor-pointer transition-all duration-500 ease-in-out",
                  {
                    "rotate-0": isGroupHovered,
                    [baseRotations[stackPosition]]: !isGroupHovered && !isTopCard,
                    "hover:scale-110": isGroupHovered && !isClicked,
                  },
                )}
                style={{
                  transform,
                  zIndex: isClicked
                    ? 200
                    : isGroupHovered
                      ? 100
                      : isTopCard
                        ? numItems
                        : numItems - stackPosition,
                }}
              >
                <div className="h-full w-full rounded-xl bg-background p-2 shadow-lg">
                  <div className="flex h-full w-full flex-col items-center justify-start">
                    <div className="h-52 w-full overflow-hidden rounded-md">
                      <img
                        src={item.src}
                        alt={item.name}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex h-10 flex-grow items-center justify-center">
                      <p className="text-xs text-muted-foreground truncate max-w-[10rem] text-center">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="text-center text-lg font-semibold text-foreground">
        {title}
      </h3>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
        >
          View All →
        </button>
      )}
    </div>
  );
});

InteractivePhotoStack.displayName = "InteractivePhotoStack";

export { InteractivePhotoStack };
