import { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Direction = "left" | "right";

function getRandomNumberInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const photos = [
  {
    id: 1, order: 0, x: "-320px", y: "15px", zIndex: 50, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=440&h=440&fit=crop&auto=format",
  },
  {
    id: 2, order: 1, x: "-160px", y: "32px", zIndex: 40, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=440&h=440&fit=crop&auto=format",
  },
  {
    id: 3, order: 2, x: "0px", y: "8px", zIndex: 30, direction: "right" as Direction,
    src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=440&h=440&fit=crop&auto=format",
  },
  {
    id: 4, order: 3, x: "160px", y: "22px", zIndex: 20, direction: "right" as Direction,
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=440&h=440&fit=crop&auto=format",
  },
  {
    id: 5, order: 4, x: "320px", y: "44px", zIndex: 10, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=440&h=440&fit=crop&auto=format",
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const photoVariants = {
  hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
  visible: (custom: { x: string; y: string; order: number }) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.15,
    },
  }),
};

export function PhotoGallery({ animationDelay = 0.5 }: { animationDelay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const t2 = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animationDelay]);

  return (
    <div className="mt-20 relative">
      {/* Grid background */}
      <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <p className="my-2 text-center text-xs font-light uppercase tracking-widest text-white">
        Manufacturing Excellence · Visual Archive
      </p>
      <h3 className="z-20 mx-auto max-w-2xl py-3 text-center text-4xl md:text-6xl font-semibold">
        <span className="text-white">Precision Crafted.</span>{" "}
        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Globally Delivered.
        </span>
      </h3>

      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt="EMUSKI manufacturing"
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex w-full justify-center pb-16">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-white text-black hover:bg-white/90"
        >
          Explore the Archive
        </Button>
      </div>

      <div className="pb-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/20">
        © EMUSKI · Visual Archive
      </div>
    </div>
  );
}

function Photo({
  src, alt, className, direction, width, height,
}: {
  src: string; alt: string; className?: string;
  direction?: Direction; width: number; height: number;
}) {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    setRotation(getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1));
  }, [direction]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{ scale: 1.1, rotateZ: 2 * (direction === "left" ? -1 : 1), zIndex: 9999 }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width, height, perspective: 400,
        WebkitUserSelect: "none", userSelect: "none", touchAction: "none",
      }}
      className={cn(className, "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing")}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(200); y.set(200); }}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>
    </motion.div>
  );
}
