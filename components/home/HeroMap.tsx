"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { HOSPITALS } from "./hospitals";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const OVERVIEW_VIEW = {
  center: [134.5, -28] as [number, number],
  zoom: 3.4,
  pitch: 0,
  bearing: 0,
};

// Top-down loop: cycles through every hospital in HOSPITALS array,
// stays flat (no pitch), comfortable city-level zoom.
const TOUR_INTERVAL_MS = 3500;
const HOSPITAL_ZOOM = 9;
const HOSPITAL_PITCH = 0;
const FLY_DURATION_MS = 2800;

export default function HeroMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0); // index into HOSPITALS — loop starts on the first one
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  // Off-screen pause — saves Mapbox tile fetches when hero is not visible
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.05 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Init map (once)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !TOKEN) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // outdoors-v12 → green landmass, blue water, terrain shading. Reads "real map" not "blank SaaS canvas".
      style: "mapbox://styles/mapbox/outdoors-v12",
      ...OVERVIEW_VIEW,
      attributionControl: false,
      cooperativeGestures: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      collectResourceTiming: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      const style = map.getStyle();
      const layers = style?.layers ?? [];
      layers.forEach((l) => {
        if (l.type === "symbol" && /label|place|poi/.test(l.id) && !/country|state|continent/.test(l.id)) {
          try { map.setLayoutProperty(l.id, "visibility", "none"); } catch {}
        }
      });


      HOSPITALS.forEach((h, i) => {
        const el = document.createElement("button");
        el.className = "sd-marker group relative grid place-items-center cursor-pointer";
        el.setAttribute("aria-label", h.name);
        el.innerHTML = `
          <span class="sd-marker__halo absolute inset-0 -m-3 rounded-full"></span>
          <span class="sd-marker__dot relative w-[10px] h-[10px] rounded-full bg-[#1a1a2e] ring-2 ring-white shadow-[0_4px_10px_rgba(26,26,46,0.3)] transition-all"></span>
        `;
        el.onclick = () => {
          setPaused(true);
          setActiveIdx(i);
        };
        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([h.lng, h.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });

      setReady(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Auto-cycle through every hospital in order, looping forever.
  useEffect(() => {
    if (!ready || paused || !inView) return;
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HOSPITALS.length);
    }, TOUR_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [ready, paused, inView]);

  // Drive flyTo + marker active styling when activeIdx changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach((m, i) => {
      const el = m.getElement();
      if (i === activeIdx) el.classList.add("is-active");
      else el.classList.remove("is-active");
    });

    if (activeIdx === -1) {
      map.flyTo({
        ...OVERVIEW_VIEW,
        duration: 2800,
        essential: true,
        curve: 1.4,
      });
      return;
    }

    const h = HOSPITALS[activeIdx];
    const bearings = [-22, 18, -10, 28, -32, 14, -18, 24];
    map.flyTo({
      center: [h.lng, h.lat],
      zoom: HOSPITAL_ZOOM,
      pitch: HOSPITAL_PITCH,
      bearing: bearings[activeIdx % bearings.length],
      duration: FLY_DURATION_MS,
      essential: true,
      curve: 1.7,
    });
  }, [activeIdx, ready]);

  // Auto-resume the tour 8s after a manual marker click
  useEffect(() => {
    if (!paused) return;
    const id = window.setTimeout(() => setPaused(false), 8000);
    return () => window.clearTimeout(id);
  }, [paused, activeIdx]);

  const active = activeIdx >= 0 ? HOSPITALS[activeIdx] : null;
  const tokenMissing = !TOKEN;

  return (
    <section ref={sectionRef} className="relative bg-white pt-24 md:pt-28 pb-16 md:pb-24 px-4 md:px-6">
      {/* soft ocean halo behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 w-[92%] max-w-[1320px] h-[88%] rounded-[40px] blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, rgba(50,50,255,0.20), transparent 70%), radial-gradient(50% 50% at 80% 70%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        {/* eyebrow row */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
            Australia&apos;s locum doctor marketplace
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
            </span>
            Live tour · {HOSPITALS.length} partners
          </div>
        </div>

        {/* The frame */}
        <div className="relative rounded-[24px] md:rounded-[28px] border border-ink/15 bg-white overflow-hidden shadow-[0_30px_90px_-40px_rgba(26,26,46,0.25)]">
          <div
            ref={mapContainer}
            className="relative w-full h-[64vh] min-h-[480px] md:h-[72vh] md:min-h-[600px]"
          />

          {tokenMissing && (
            <div className="absolute inset-0 grid place-items-center bg-bone">
              <div className="text-center max-w-md px-6">
                <div className="eyebrow mb-3">Map disabled</div>
                <p className="text-sm text-muted">
                  Add <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">NEXT_PUBLIC_MAPBOX_TOKEN</code> to <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">.env.local</code> and restart.
                </p>
              </div>
            </div>
          )}

          {/* Top-right active label */}
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute top-4 right-4 md:top-5 md:right-5 z-10 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/92 backdrop-blur-md border border-ink/10 shadow-sm max-w-[88vw]"
              >
                <span className="w-2 h-2 rounded-full bg-electric shrink-0" />
                <div className="text-[13px] md:text-[14px] truncate leading-tight">
                  <span className="font-semibold">{active.name}</span>
                  <span className="text-muted text-[11px] md:text-[12px]"> · {active.state} · {active.type}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating glass CTA card — bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-4 right-4 bottom-4 md:left-5 md:right-auto md:bottom-5 z-10 max-w-md md:w-[400px] p-5 rounded-2xl bg-white/92 backdrop-blur-xl border border-ink/12 shadow-[0_30px_70px_-20px_rgba(26,26,46,0.25)]"
          >
            <h1 className="display text-[clamp(20px,2.5vw,30px)] leading-[1.05]">
              Shifts that pay you fully.{" "}
              <span className="italic text-ocean">No agency in the middle.</span>
            </h1>

            <div className="mt-4 flex items-center gap-4 text-[10px] tracking-[0.18em] uppercase">
              <Stat value={`${HOSPITALS.length}`} label="Hospitals" />
              <span className="w-px h-6 bg-ink/15" />
              <Stat value="300+" label="Doctors" />
              <span className="w-px h-6 bg-ink/15" />
              <Stat value="0%" label="Commission" />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <a
                href="https://linktr.ee/statdoctorau"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-ocean text-white text-xs md:text-sm font-semibold hover:bg-ink transition-colors"
                data-hover
              >
                Join as a doctor
                <span aria-hidden>→</span>
              </a>
              <a
                href="/hospitals"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-ink/20 text-ink text-xs md:text-sm font-medium hover:bg-bone hover:border-ink transition-colors"
                data-hover
              >
                Join as a hospital
                <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>

        </div>

        {/* Caption row */}
        <div className="mt-4 flex items-center justify-between px-1 text-[10px] tracking-[0.22em] uppercase text-muted">
          <span>Looping through {HOSPITALS.length} partners across Australia</span>
          <span className="hidden md:inline">Click any pin to focus</span>
        </div>
      </div>

      {/* Marker styles */}
      <style jsx global>{`
        .sd-marker { transform: translate(-50%, -50%); }
        .sd-marker__halo {
          background: radial-gradient(circle, rgba(205,227,93,0.55), rgba(205,227,93,0) 65%);
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .sd-marker.is-active .sd-marker__halo {
          opacity: 1;
          transform: scale(1.4);
          animation: sd-marker-pulse 2.2s ease-out infinite;
        }
        .sd-marker.is-active .sd-marker__dot {
          background: #cde35d;
          box-shadow: 0 0 0 3px #1a1a2e, 0 6px 18px rgba(26,26,46,0.35);
          transform: scale(1.4);
        }
        .sd-marker:hover .sd-marker__dot { transform: scale(1.25); }
        @keyframes sd-marker-pulse {
          0%   { opacity: 0.85; transform: scale(0.9); }
          70%  { opacity: 0;    transform: scale(2.4); }
          100% { opacity: 0;    transform: scale(2.4); }
        }
        .mapboxgl-canvas:focus { outline: none; }
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
      `}</style>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="display text-xl md:text-2xl normal-case tracking-tight leading-none">
        {value}
      </div>
      <div className="mt-1 text-[9px] text-muted">{label}</div>
    </div>
  );
}
