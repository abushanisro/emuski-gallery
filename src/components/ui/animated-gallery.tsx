import * as React from "react"
import {
  type HTMLMotionProps,
  type MotionValue,
  type Variants,
  motion,
  useScroll,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
}

const blurVariants: Variants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) throw new Error("useContainerScrollContext must be used within a ContainerScroll")
  return context
}

export const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn("relative h-[300vh]", className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = "ContainerScroll"

export const ContainerSticky = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("sticky top-0 h-screen overflow-hidden", className)} {...props} />
)
ContainerSticky.displayName = "ContainerSticky"

export const GalleryContainer = ({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) => {
  const { scrollYProgress } = useContainerScrollContext()
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [12, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.4, 1])

  return (
    <div style={{ perspective: "1200px" }} className="h-full w-full">
      <motion.div
        style={{ rotateX, scale, ...style }}
        className={cn(
          "grid h-full w-full origin-top grid-cols-3 gap-3 px-4",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}
GalleryContainer.displayName = "GalleryContainer"

export const GalleryCol = ({
  className,
  style,
  yRange = ["0%", "-10%"],
  ...props
}: HTMLMotionProps<"div"> & { yRange?: [string, string] }) => {
  const { scrollYProgress } = useContainerScrollContext()
  const y = useTransform(scrollYProgress, [0.5, 1], yRange)

  return (
    <motion.div
      style={{ y, ...style }}
      className={cn("flex flex-col gap-3 overflow-hidden", className)}
      {...props}
    />
  )
}
GalleryCol.displayName = "GalleryCol"

export const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, viewport, transition, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, ...(viewport as object) }}
      transition={{ staggerChildren: 0.1, ...transition }}
      className={cn("", className)}
      {...props}
    />
  ),
)
ContainerStagger.displayName = "ContainerStagger"

export const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, transition, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={blurVariants}
      transition={{ ...SPRING_CONFIG, ...transition }}
      className={cn("", className)}
      {...props}
    />
  ),
)
ContainerAnimated.displayName = "ContainerAnimated"
