import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState, Suspense } from "react";
import { galleryItems, sectors, type GalleryItem } from "@/lib/gallery-data";
import emuskiLogo from "@/assets/emuski-logo.png.asset.json";
import imgAllIndustry from "@/assets/image3.png";
import imgAllParts from "@/assets/social-banner.jpg";
import imgSpaceIndustry from "@/assets/space/image.png";
import imgSpaceParts from "@/assets/space/image2.png";
import imgDefenceIndustry from "@/assets/defense/image.png";
import imgDefenceParts from "@/assets/defense/image2.png";
import imgAerospaceIndustry from "@/assets/areospace/image.png";
import imgAerospaceParts from "@/assets/areospace/image2.png";
import imgClimateIndustry from "@/assets/Climate/image1.png";
import imgClimateParts from "@/assets/Climate/image2.png";
import imgAgricultureIndustry from "@/assets/Agriculture/image.png";
import imgAgricultureParts from "@/assets/Agriculture/image2.png";
import imgAutomotiveIndustry from "@/assets/Automotive/image1.png";
import imgAutomotiveParts from "@/assets/Automotive/image2.png";
import imgFighterJetIndustry from "@/assets/Fighter Jet/image1.png";
import imgFighterJetParts from "@/assets/Fighter Jet/image2.png";
import imgHealthcareIndustry from "@/assets/Healthcare/image.png";
import imgHealthcareParts from "@/assets/Healthcare/image2.png";
import imgRoboticsIndustry from "@/assets/Robotics/image.png";
import imgRoboticsParts from "@/assets/Robotics/image2.png";
import imgFieldWorkIndustry from "@/assets/cncfire.png";
import imgFieldWorkParts from "@/assets/cnc.png";
import imgManufacturingIndustry from "@/assets/manufaturing/image.png";
import imgManufacturingParts from "@/assets/manufaturing/image1.png";
import {
  ContainerScroll,
  ContainerSticky,
  GalleryContainer,
  GalleryCol,
} from "@/components/ui/animated-gallery";
import { Canvas } from "@react-three/fiber";
import { ParticleSphere } from "@/components/ui/cosmos-3d-orbit-gallery";
import { PhotoGallery } from "@/components/ui/gallery";
import { AnimatedHikeCard, type Stat } from "@/components/ui/card-25";
import { Image, Video, Layers, Rocket, Shield, Plane, Wind, Sprout, Car, Crosshair, HeartPulse, Bot, HardHat, Factory, LayoutGrid, ArrowLeft } from "lucide-react";

const mfRaw = import.meta.glob<{ default: string }>(
  "../assets/manufatuirng-facility/*",
  { eager: true }
);
const localManufacturingItems = Object.entries(mfRaw).filter(([path]) => !path.includes("IMG_1026")).map(([path, mod]) => {
  const filename = path.split("/").pop() ?? path;
  const isVideo = /\.(mp4|mov)$/i.test(filename);
  const isPng = /\.png$/i.test(filename);
  return {
    id: path,
    name: filename,
    mime: isVideo ? "video/mp4" : isPng ? "image/png" : "image/jpeg",
    sectors: ["Manufacturing"],
    album: "Manufacturing Facility",
    localUrl: mod.default,
  };
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMUSKI — Visual Archive" },
      {
        name: "description",
        content:
          "All photos and clips from EMUSKI's work, organised by sector — Space Tech, Defence, Aerospace, Climate, Agriculture, Automotive, Fighter Jet, Healthcare, Robotics and Field Work.",
      },
    ],
  }),
  component: Gallery,
});

const thumb = (id: string, w = 600) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
const full = (id: string) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w2400`;

const SECTOR_META: Record<string, { icon: React.ReactNode; description: string }> = {
  "All":         { icon: <LayoutGrid className="h-4 w-4" />, description: "The complete EMUSKI visual archive spanning every sector and project." },
  "Space Tech":  { icon: <Rocket className="h-4 w-4" />,    description: "Precision components and systems engineered for the space frontier." },
  "Defence":     { icon: <Shield className="h-4 w-4" />,    description: "High-grade manufacturing for defence applications and equipment." },
  "Aerospace":   { icon: <Plane className="h-4 w-4" />,     description: "Structural and system components for the aerospace industry." },
  "Climate":     { icon: <Wind className="h-4 w-4" />,      description: "Sustainable engineering solutions for climate and energy sectors." },
  "Agriculture": { icon: <Sprout className="h-4 w-4" />,    description: "Robust machinery and components for modern agricultural use." },
  "Automotive":  { icon: <Car className="h-4 w-4" />,       description: "Precision-crafted parts powering the automotive industry." },
  "Fighter Jet": { icon: <Crosshair className="h-4 w-4" />, description: "Advanced manufacturing for high-performance fighter aircraft." },
  "Healthcare":  { icon: <HeartPulse className="h-4 w-4" />,description: "Medical-grade precision components for healthcare applications." },
  "Robotics":    { icon: <Bot className="h-4 w-4" />,       description: "Engineered systems and components driving robotic innovation." },
  "Field Work":  { icon: <HardHat className="h-4 w-4" />,   description: "Durable equipment and documentation from demanding field operations." },
  "Manufacturing": { icon: <Factory className="h-4 w-4" />, description: "State-of-the-art manufacturing facilities and precision production processes." },
};

const SECTOR_CARD_IMAGES: Record<string, [string, string]> = {
  "All":         [imgAllIndustry,        imgAllParts],
  "Space Tech":  [imgSpaceIndustry,      imgSpaceParts],
  "Defence":     [imgDefenceIndustry,    imgDefenceParts],
  "Aerospace":   [imgAerospaceIndustry,  imgAerospaceParts],
  "Climate":     [imgClimateIndustry,    imgClimateParts],
  "Agriculture": [imgAgricultureIndustry,imgAgricultureParts],
  "Automotive":  [imgAutomotiveIndustry, imgAutomotiveParts],
  "Fighter Jet": [imgFighterJetIndustry, imgFighterJetParts],
  "Healthcare":  [imgHealthcareIndustry, imgHealthcareParts],
  "Robotics":    [imgRoboticsIndustry,   imgRoboticsParts],
  "Field Work":  [imgFieldWorkIndustry,  imgFieldWorkParts],
  "Manufacturing": [imgManufacturingIndustry, imgManufacturingParts],
};

const HERO_COL_1 = [
  "1qr0lpbXoO4tPcWXWuZLKTJ_S_Y5vxdFY",
  "16sOG9wq9D4QFPCEL7n52tr0FVjBvbxt6",
  "1ldf7luUOsuUvtuOBZ-Rrza-5E1ScI_sR",
  "1fQIDgI5DKXRKp8fd8KkB9_RtHxicsHVq",
];
const HERO_COL_2 = [
  "1dYS9Y1-UcFZ_luMLfGlmnDOoepRsMUpv",
  "15ztsk_1FfDh4GlC8tUTU0yNIUGIL_PbF",
  "1RrhCtVCGA_w7y_HtPmQMzuztotyC93Am",
  "1B6JVrgy3vBSJnha7DFfJzxC-LRW9QlzK",
];
const HERO_COL_3 = [
  "1rUMaWW0qHBuOzVAsKiJp7Re8aYGrwtXy",
  "1Hq2sjKEDZZNq1pSHHGh4n5yG2c0ZFEZK",
  "13GfEFrmLrqLrtwExW-JETlgb7qaBLGzX",
  "1UzxTj-t9v0fHgaUFkxqHuLYof74IOpJp",
];



function prettyName(name: string) {
  return name
    .replace(/\.(jpe?g|png|heic|webp|mp4|mov)$/i, "")
    .replace(/^WhatsApp Image /i, "")
    .replace(/^WhatsApp Video /i, "Clip ")
    .replace(/^IMG[-_]?/i, "")
    .replace(/^VID[-_]?/i, "Clip ")
    .replace(/[-_]+/g, " ")
    .trim();
}

function Gallery() {
  const [view, setView] = useState<"folders" | "gallery">("folders");
  const [sector, setSector] = useState<string>("All");
  const [type, setType] = useState<"all" | "image" | "video">("all");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const allItems = useMemo(() => [...galleryItems, ...localManufacturingItems], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((it) => {
      if (sector !== "All" && !it.sectors.includes(sector)) return false;
      if (type === "image" && !it.mime.startsWith("image/")) return false;
      if (type === "video" && !it.mime.startsWith("video/")) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.sectors.join(" ").toLowerCase().includes(q) ||
        it.album.toLowerCase().includes(q)
      );
    });
  }, [sector, type, query]);

  const counts = useMemo(() => {
    const s: Record<string, number> = { All: allItems.length };
    for (const x of sectors)
      s[x] = allItems.filter((i) => i.sectors.includes(x)).length;
    return s;
  }, [allItems]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Animated Hero ── */}
      <header className="relative bg-black">
        {/* Brand wordmark — centred over the gallery */}
        <div className="absolute inset-x-0 top-0 z-20 flex h-screen flex-col items-center justify-center gap-1 pointer-events-none">
          <img
            src={emuskiLogo.url}
            alt="EMUSKI"
            className="h-10 w-10 shadow-2xl sm:h-16 sm:w-16"
          />
          <div className="text-center leading-none">
            <p className="text-5xl font-bold tracking-[0.1em] text-white drop-shadow-lg sm:text-7xl md:text-8xl">
              EMUSKI
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-xs">
              Manufacturing Excellence
            </p>
          </div>
        </div>

        {/* Gradient vignette so logo stays legible */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

        <ContainerScroll>
          <ContainerSticky>
            <GalleryContainer>
              <GalleryCol yRange={["0%", "-12%"]}>
                {HERO_COL_1.map((id) => (
                  <img
                    key={id}
                    src={thumb(id, 800)}
                    alt="EMUSKI"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </GalleryCol>

              <GalleryCol yRange={["15%", "3%"]} className="mt-[-55%]">
                {HERO_COL_2.map((id) => (
                  <img
                    key={id}
                    src={thumb(id, 800)}
                    alt="EMUSKI"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </GalleryCol>

              <GalleryCol yRange={["-12%", "2%"]} className="-mt-4">
                {HERO_COL_3.map((id) => (
                  <img
                    key={id}
                    src={thumb(id, 800)}
                    alt="EMUSKI"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </GalleryCol>
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      </header>

      {/* ── Filters ── */}
      <section className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl space-y-2 px-3 py-3 sm:px-6 sm:py-4">
          {view === "gallery" && (
            <button
              onClick={() => setView("folders")}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:border-foreground/40 hover:bg-background hover:text-foreground hover:shadow-md sm:px-4 sm:py-1.5 sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 sm:h-4 sm:w-4" />
              <span>Folders</span>
              {sector !== "All" && (
                <>
                  <span className="text-border">/</span>
                  <span className="font-semibold text-foreground">{sector}</span>
                </>
              )}
            </button>
          )}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {["All", ...sectors].map((c) => {
              const active = sector === c;
              const n = counts[c] ?? 0;
              return (
                <button
                  key={c}
                  onClick={() => { setSector(c); setView("gallery"); }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  } ${n === 0 ? "opacity-50" : ""}`}
                >
                  {c}
                  <span
                    className={`rounded-full px-1 py-0.5 text-[9px] sm:px-1.5 sm:text-[10px] ${
                      active ? "bg-background/20" : "bg-muted"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 rounded-full border border-border bg-card p-1 text-xs">
              {(["all", "image", "video"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full px-2.5 py-1 capitalize transition sm:px-3 ${
                    type === t
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "all" ? "All" : t + "s"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="shrink-0 text-xs text-muted-foreground">
                {filtered.length}/{allItems.length}
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-full border border-border bg-card px-4 py-1.5 text-sm outline-none transition focus:border-foreground sm:w-64 sm:py-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Folder View ── */}
      {view === "folders" && (
        <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {sectors.map((s) => {
              const sectorItems = s === "All" ? allItems : allItems.filter((i) => i.sectors.includes(s));
              const images = Array.from(SECTOR_CARD_IMAGES[s] ?? SECTOR_CARD_IMAGES["All"]);
              const imgCount = sectorItems.filter((i) => i.mime.startsWith("image/")).length;
              const vidCount = sectorItems.filter((i) => i.mime.startsWith("video/")).length;
              const meta = SECTOR_META[s];
              const stats: Stat[] = [
                { icon: <Layers className="h-4 w-4" />, label: `${counts[s] ?? galleryItems.length} total` },
                { icon: <Image className="h-4 w-4" />,  label: `${imgCount}` },
                { icon: <Video className="h-4 w-4" />,  label: `${vidCount}` },
              ];
              return (
                <AnimatedHikeCard
                  key={s}
                  title={s}
                  images={images}
                  stats={stats}
                  description={meta?.description ?? ""}
                  onClick={() => { setSector(s); setView("gallery"); }}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── Masonry Grid ── */}
      {view === "gallery" && (
        <>
          <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
            {filtered.length === 0 ? (
              <p className="py-24 text-center text-muted-foreground">
                No media match these filters.
              </p>
            ) : (
              <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 [&>*]:mb-2 sm:[&>*]:mb-3">
                {filtered.map((it) => {
                  const isVideo = it.mime.startsWith("video/");
                  return (
                    <button
                      key={it.id}
                      onClick={() => setLightbox(it)}
                      className="group relative block w-full overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      {isVideo && it.localUrl ? (
                        <video
                          src={it.localUrl}
                          muted
                          preload="metadata"
                          className="w-full transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <img
                          src={it.localUrl ?? thumb(it.id, 600)}
                          alt={prettyName(it.name)}
                          loading="lazy"
                          className="w-full transition duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                          }}
                        />
                      )}
                      {isVideo && (
                        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white">
                          ▶ Video
                        </span>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-left text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-[10px] uppercase tracking-widest opacity-80">
                          {it.sectors.join(" · ")}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur sm:p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white hover:bg-white/10 sm:right-4 sm:top-4 sm:h-auto sm:w-auto sm:px-3 sm:py-1 sm:text-xs"
          >
            <span className="sm:hidden">✕</span>
            <span className="hidden sm:inline">Close ✕</span>
          </button>
          <figure
            className="flex max-h-full w-full max-w-6xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.mime.startsWith("video/") ? (
              lightbox.localUrl ? (
                <video
                  src={lightbox.localUrl}
                  controls
                  autoPlay
                  className="h-[60vh] w-full max-w-5xl rounded-lg sm:h-[70vh] sm:w-[90vw]"
                />
              ) : (
                <iframe
                  src={`https://drive.google.com/file/d/${lightbox.id}/preview`}
                  allow="autoplay"
                  className="h-[60vh] w-full max-w-5xl rounded-lg sm:h-[70vh] sm:w-[90vw]"
                />
              )
            ) : (
              <img
                src={lightbox.localUrl ?? full(lightbox.id)}
                alt={prettyName(lightbox.name)}
                className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
              />
            )}
            <figcaption className="text-center text-white">
              <p className="text-xs uppercase tracking-widest opacity-70">
                {lightbox.sectors.join(" · ")}
              </p>
            </figcaption>
          </figure>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="relative bg-black pb-10 pt-12 min-h-[400px] sm:pt-20 sm:min-h-[600px]">
        {/* Amber radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,oklch(0.7_0.15_185/0.35),transparent_80%)]" />

        {/* WebGL particle sphere — behind all content */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Suspense fallback={<div className="h-full w-full bg-black" />}>
            <Canvas
              camera={{ position: [-10, 1.5, 10], fov: 50 }}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false)
              }}
            >
              <ambientLight intensity={0.6} />
              <ParticleSphere />
            </Canvas>
          </Suspense>
        </div>

        {/* PhotoGallery over the cosmos */}
        <div className="relative z-10">
          <PhotoGallery />
        </div>
      </footer>
    </main>
  );
}
