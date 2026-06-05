"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface PolaroidMarker {
  id: string;
  location: [number, number];
  image: string;
  caption: string;
  rotate: number;
}

interface GlobePolaroidsProps {
  markers?: PolaroidMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: PolaroidMarker[] = [
  { id: "polaroid-sf", location: [37.78, -122.44], image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=160&h=160&fit=crop", caption: "San Francisco", rotate: -5 },
  { id: "polaroid-detroit", location: [42.33, -83.05], image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=160&h=160&fit=crop", caption: "Detroit", rotate: 4 },
  { id: "polaroid-mexico", location: [19.43, -99.13], image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=160&h=160&fit=crop", caption: "Mexico City", rotate: -3 },
  { id: "polaroid-saopaulo", location: [-23.55, -46.63], image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=160&h=160&fit=crop", caption: "São Paulo", rotate: 5 },
  { id: "polaroid-london", location: [51.51, -0.13], image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=160&h=160&fit=crop", caption: "London", rotate: 3 },
  { id: "polaroid-stuttgart", location: [48.78, 9.18], image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=160&h=160&fit=crop", caption: "Stuttgart", rotate: -4 },
  { id: "polaroid-bengaluru", location: [12.97, 77.59], image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=160&h=160&fit=crop", caption: "Bengaluru", rotate: 4 },
  { id: "polaroid-shenzhen", location: [22.54, 114.06], image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=160&h=160&fit=crop", caption: "Shenzhen", rotate: -2 },
  { id: "polaroid-seoul", location: [37.57, 126.98], image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=160&h=160&fit=crop", caption: "Seoul", rotate: 3 },
  { id: "polaroid-tokyo", location: [35.68, 139.65], image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=160&h=160&fit=crop", caption: "Tokyo", rotate: -3 },
  { id: "polaroid-sydney", location: [-33.87, 151.21], image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=160&h=160&fit=crop", caption: "Sydney", rotate: 6 },
  { id: "polaroid-johannesburg", location: [-26.2, 28.05], image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=160&h=160&fit=crop", caption: "Johannesburg", rotate: -5 },
];

export function GlobePolaroids({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobePolaroidsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      const renderState = { phi: 0, theta: 0.2 };
      const updateMarkers = (st: { phi: number; theta: number }) => {
        const r = width / 2;
        const cx = r;
        const cy = r;
        if (!containerRef.current) return;
        const children = containerRef.current.querySelectorAll<HTMLDivElement>("[data-marker-id]");
        children.forEach((el) => {
          const id = el.dataset.markerId!;
          const m = markers.find((x) => x.id === id);
          if (!m) return;
          const [lat, lon] = m.location;
          const latRad = (lat * Math.PI) / 180;
          const lonRad = (lon * Math.PI) / 180;
          const x3 = Math.cos(latRad) * Math.sin(lonRad + st.phi);
          const y3 =
            Math.sin(latRad) * Math.cos(st.theta) -
            Math.cos(latRad) * Math.cos(lonRad + st.phi) * Math.sin(st.theta);
          const z3 =
            Math.cos(latRad) * Math.cos(lonRad + st.phi) * Math.cos(st.theta) +
            Math.sin(latRad) * Math.sin(st.theta);
          const x = cx + x3 * r * 0.95;
          const y = cy - y3 * r * 0.95;
          const visible = z3 > 0.15 ? 1 : 0;
          el.style.transform = `translate(${x}px, ${y - 80}px) translate(-50%, 0) rotate(${el.dataset.rotate}deg)`;
          el.style.opacity = String(visible);
        });
      };

      const opts = {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.35],
        markerColor: [0.95, 0.6, 0.2],
        glowColor: [0.2, 0.2, 0.3],
        markers: markers.map((m) => ({ location: m.location, size: 0.05 })),
        onRender: (state: { phi: number; theta: number }) => {
          if (!isPausedRef.current) phi += speed;
          state.phi = phi + phiOffsetRef.current + dragOffset.current.phi;
          state.theta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta;
          renderState.phi = state.phi;
          renderState.theta = state.theta;
          updateMarkers(renderState);
        },
      };

      globe = createGlobe(canvas, opts as unknown as Parameters<typeof createGlobe>[1]);
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div ref={containerRef} className={`relative mx-auto aspect-square w-full max-w-[640px] ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
          contain: "layout paint size",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          data-marker-id={m.id}
          data-rotate={m.rotate}
          className="pointer-events-none absolute left-0 top-0"
          style={{
            background: "#fff",
            padding: "6px 6px 22px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
            transition: "opacity 0.3s",
            opacity: 0,
          }}
        >
          <img
            src={m.image}
            alt={m.caption}
            style={{ display: "block", width: 56, height: 56, objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 4,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.55rem",
              color: "#333",
              letterSpacing: "0.04em",
            }}
          >
            {m.caption}
          </span>
        </div>
      ))}
    </div>
  );
}
