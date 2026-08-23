"use client";

import { GlobeConfig, Position, World } from "./ui/globe";

const globeConfig: GlobeConfig = {
  pointSize: 3,
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.12,
  polygonColor: "rgba(255,255,255,0.68)",
  globeColor: "#020617",
  emissive: "#0b1120",
  emissiveIntensity: 0.22,
  shininess: 0.8,
  arcTime: 1800,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
};

const data: Position[] = [
  { order: 1, startLat: 12.97, startLng: 77.59, endLat: 37.77, endLng: -122.42, arcAlt: 0.22, color: "#ffffff" },
  { order: 2, startLat: 12.97, startLng: 77.59, endLat: 51.51, endLng: -0.13, arcAlt: 0.28, color: "#a1a1aa" },
  { order: 3, startLat: 12.97, startLng: 77.59, endLat: 35.68, endLng: 139.65, arcAlt: 0.3, color: "#ffffff" },
  { order: 4, startLat: 28.61, startLng: 77.21, endLat: 40.71, endLng: -74.01, arcAlt: 0.24, color: "#a1a1aa" },
  { order: 5, startLat: 48.86, startLng: 2.35, endLat: 31.23, endLng: 121.47, arcAlt: 0.25, color: "#ffffff" },
  { order: 6, startLat: -33.87, startLng: 151.21, endLat: 1.35, endLng: 103.82, arcAlt: 0.22, color: "#a1a1aa" },
  { order: 7, startLat: 19.08, startLng: 72.88, endLat: 25.20, endLng: 55.27, arcAlt: 0.18, color: "#ffffff" },
  { order: 8, startLat: 52.52, startLng: 13.40, endLat: 43.65, endLng: -79.38, arcAlt: 0.28, color: "#a1a1aa" },
];

export function GithubGlobe() {
  return (
    <div className="relative h-[390px] w-[390px] max-w-full overflow-hidden rounded-full [mask-image:radial-gradient(circle,black_54%,transparent_74%)]">
      <World globeConfig={globeConfig} data={data} />
    </div>
  );
}
