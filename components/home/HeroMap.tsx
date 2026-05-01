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

// Slow + cinematic on click. Same Mapbox SKU — no cost change.
const HOSPITAL_ZOOM = 16.5;
const HOSPITAL_PITCH = 60;
const FLY_DURATION_MS = 7500;
const ORBIT_STEP_DEG = 6;
const ORBIT_STEP_MS = 4500;
const OVERVIEW_DURATION_MS = 3500;

export default function HeroMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const orbitTimerRef = useRef<number | null>(null);
  const orbitBearingRef = useRef<number>(0);
  const activeIdxRef = useRef<number>(-1);

  const [activeIdx, setActiveIdx] = useState<number>(-1); // currently focused hospital
  const [hoverIdx, setHoverIdx] = useState<number>(-1);   // currently hovered pin
  const [ready, setReady] = useState(false);

  const stopOrbit = () => {
    if (orbitTimerRef.current !== null) {
      window.clearTimeout(orbitTimerRef.current);
      orbitTimerRef.current = null;
    }
  };

  const startOrbit = (lng: number, lat: number, expectIdx: number) => {
    stopOrbit();
    orbitBearingRef.current = 0;
    const tick = () => {
      if (!mapRef.current) return;
      if (activeIdxRef.current !== expectIdx) return;
      orbitBearingRef.current = (orbitBearingRef.current + ORBIT_STEP_DEG) % 360;
      mapRef.current.easeTo({
        center: [lng, lat],
        zoom: HOSPITAL_ZOOM,
        pitch: HOSPITAL_PITCH,
        bearing: orbitBearingRef.current,
        duration: ORBIT_STEP_MS,
        easing: (t) => t, // linear, no extra acceleration → calm
      });
      orbitTimerRef.current = window.setTimeout(tick, ORBIT_STEP_MS);
    };
    tick();
  };

  const focusHospital = (i: number) => {
    if (!mapRef.current) return;
    stopOrbit();
    activeIdxRef.current = i;
    setActiveIdx(i);
    const h = HOSPITALS[i];
    mapRef.current.flyTo({
      center: [h.lng, h.lat],
      zoom: HOSPITAL_ZOOM,
      pitch: HOSPITAL_PITCH,
      bearing: 0,
      duration: FLY_DURATION_MS,
      curve: 1.5,
      essential: true,
    });
    // Start gentle orbit after the fly-in lands
    window.setTimeout(() => {
      if (activeIdxRef.current === i) startOrbit(h.lng, h.lat, i);
    }, FLY_DURATION_MS + 200);
  };

  const goOverview = () => {
    if (!mapRef.current) return;
    stopOrbit();
    activeIdxRef.current = -1;
    setActiveIdx(-1);
    mapRef.current.flyTo({
      ...OVERVIEW_VIEW,
      duration: OVERVIEW_DURATION_MS,
      curve: 1.4,
      essential: true,
    });
  };

  // Init map (once)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !TOKEN) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // satellite-streets-v12 → real photographic satellite + roads/labels.
      // The Google Earth feel without leaving the free tier.
      style: "mapbox://styles/mapbox/satellite-streets-v12",
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
      HOSPITALS.forEach((h, i) => {
        const el = document.createElement("button");
        el.className = "sd-marker group relative grid place-items-center cursor-pointer";
        el.setAttribute("aria-label", h.name);
        el.innerHTML = `
          <span class="sd-marker__halo absolute inset-0 -m-4 rounded-full"></span>
          <span class="sd-marker__dot relative w-3 h-3 rounded-full bg-[#cde35d] ring-2 ring-[#1a1a2e] shadow-[0_4px_10px_rgba(26,26,46,0.45)] transition-all"></span>
        `;
        el.onclick = (e) => {
          e.stopPropagation();
          focusHospital(i);
        };
        el.onmouseenter = () => setHoverIdx(i);
        el.onmouseleave = () => setHoverIdx(-1);

        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([h.lng, h.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
      setReady(true);
    });

    return () => {
      stopOrbit();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Pause orbit when section scrolls off-screen — saves tile fetches
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries[0]?.isIntersecting ?? true;
        if (!inView && orbitTimerRef.current !== null) stopOrbit();
        else if (inView && activeIdxRef.current >= 0 && orbitTimerRef.current === null) {
          const h = HOSPITALS[activeIdxRef.current];
          startOrbit(h.lng, h.lat, activeIdxRef.current);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Apply active styling to markers
  useEffect(() => {
    if (!ready) return;
    markersRef.current.forEach((m, i) => {
      const el = m.getElement();
      el.classList.toggle("is-active", i === activeIdx);
      el.classList.toggle("is-hover", i === hoverIdx && i !== activeIdx);
    });
  }, [activeIdx, hoverIdx, ready]);

  // The chip showing hospital info — hover takes priority, falls back to active
  const chipIdx = hoverIdx >= 0 ? hoverIdx : activeIdx;
  const chipHospital = chipIdx >= 0 ? HOSPITALS[chipIdx] : null;
  const tokenMissing = !TOKEN;

  return (
    <section ref={sectionRef} className="relative bg-white pt-24 md:pt-28 pb-16 md:pb-24 px-4 md:px-6">
      {/* soft halo behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 w-[92%] max-w-[1320px] h-[88%] rounded-[40px] blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, rgba(50,50,255,0.20), transparent 70%), radial-gradient(50% 50% at 80% 70%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        {/* eyebrow */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
            Australia&apos;s locum doctor marketplace
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
            </span>
            {HOSPITALS.length} partners · interactive
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
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">Map disabled</div>
                <p className="text-sm text-muted">
                  Add <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">NEXT_PUBLIC_MAPBOX_TOKEN</code> to <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">.env.local</code> and restart.
                </p>
              </div>
            </div>
          )}

          {/* Hospital info chip — top-right, follows hover (priority) or active */}
          <AnimatePresence mode="wait">
            {chipHospital && (
              <motion.div
                key={chipHospital.name}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute top-4 right-4 md:top-5 md:right-5 z-10 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-ink/10 shadow-lg max-w-[88vw]"
              >
                <span className="w-2 h-2 rounded-full bg-electric shrink-0" />
                <div className="text-[13px] md:text-[14px] truncate leading-tight">
                  <span className="font-semibold">{chipHospital.name}</span>
                  <span className="text-muted text-[11px] md:text-[12px]"> · {chipHospital.state} · {chipHospital.type}</span>
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

          {/* Back to Australia — top-left, only when zoomed in */}
          <AnimatePresence>
            {activeIdx >= 0 && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                onClick={goOverview}
                className="absolute top-4 left-4 md:top-5 md:left-5 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-white text-xs md:text-sm font-semibold shadow-lg hover:bg-ocean transition-colors"
                data-hover
              >
                <span aria-hidden>←</span>
                Back to Australia
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Caption */}
        <div className="mt-4 flex items-center justify-between px-1 text-[10px] tracking-[0.22em] uppercase text-muted">
          <span>
            {activeIdx >= 0
              ? "Drag back or hit ← to see all 44 partners"
              : "Click any pin to see our partner"}
          </span>
          <span className="hidden md:inline">Hover for details</span>
        </div>
      </div>

      {/* Marker styles */}
      <style jsx global>{`
        .sd-marker { transform: translate(-50%, -50%); }
        .sd-marker__halo {
          background: radial-gradient(circle, rgba(205,227,93,0.55), rgba(205,227,93,0) 65%);
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.35s ease, transform 0.5s ease;
        }
        .sd-marker:hover .sd-marker__dot,
        .sd-marker.is-hover .sd-marker__dot {
          transform: scale(1.35);
          background: #cde35d;
          box-shadow: 0 0 0 3px #1a1a2e, 0 6px 18px rgba(26,26,46,0.45);
        }
        .sd-marker:hover .sd-marker__halo,
        .sd-marker.is-hover .sd-marker__halo {
          opacity: 1;
          transform: scale(1.2);
        }
        .sd-marker.is-active .sd-marker__dot {
          background: #cde35d;
          box-shadow: 0 0 0 3px #1a1a2e, 0 6px 22px rgba(205,227,93,0.65);
          transform: scale(1.5);
        }
        .sd-marker.is-active .sd-marker__halo {
          opacity: 1;
          transform: scale(1.5);
          animation: sd-marker-pulse 2.6s ease-out infinite;
        }
        @keyframes sd-marker-pulse {
          0%   { opacity: 0.85; transform: scale(0.9); }
          70%  { opacity: 0;    transform: scale(2.6); }
          100% { opacity: 0;    transform: scale(2.6); }
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
