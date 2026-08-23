"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Fog, PerspectiveCamera, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, Object3DNode, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../../data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const CAMERA_Z = 300;
const ASPECT = 1.2;

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
};

type WorldProps = { globeConfig: GlobeConfig; data: Position[] };

let ringIndices = [0];

function hexToRgb(hex: string) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function randomNumbers(max: number, count: number) {
  const values: number[] = [];
  while (values.length < count) {
    const value = Math.floor(Math.random() * max);
    if (!values.includes(value)) values.push(value);
  }
  return values;
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeData, setGlobeData] = useState<Array<{ size: number; order: number; color: (t: number) => string; lat: number; lng: number }> | null>(null);

  const config = useMemo(() => ({
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.72)",
    globeColor: "#020617",
    emissive: "#020617",
    emissiveIntensity: 0.18,
    shininess: 0.9,
    arcTime: 1400,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }), [globeConfig]);

  useEffect(() => {
    if (!globeRef.current) return;
    const points = data.flatMap((arc) => {
      const rgb = hexToRgb(arc.color) ?? { r: 255, g: 255, b: 255 };
      const color = (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;
      return [
        { size: config.pointSize, order: arc.order, color, lat: arc.startLat, lng: arc.startLng },
        { size: config.pointSize, order: arc.order, color, lat: arc.endLat, lng: arc.endLng },
      ];
    });
    setGlobeData(points.filter((point, index, all) => all.findIndex((other) => other.lat === point.lat && other.lng === point.lng) === index));
  }, [data, config.pointSize]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;
    globeRef.current
      .hexPolygonsData((countries as { features: unknown[] }).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as Position).startLat)
      .arcStartLng((d) => (d as Position).startLng)
      .arcEndLat((d) => (d as Position).endLat)
      .arcEndLng((d) => (d as Position).endLng)
      .arcColor((d) => (d as Position).color)
      .arcAltitude((d) => (d as Position).arcAlt)
      .arcStroke(() => 0.32)
      .arcDashLength(config.arcLength)
      .arcDashInitialGap((d) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => config.arcTime);

    globeRef.current
      .ringsData([])
      .ringColor((d: any) => (t: number) => d.color(t))
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);
  }, [data, globeData, config]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;
    const interval = window.setInterval(() => {
      ringIndices = randomNumbers(globeData.length, Math.max(1, Math.floor(globeData.length * 0.75)));
      globeRef.current?.ringsData(globeData.filter((_, i) => ringIndices.includes(i)));
    }, 2000);
    return () => window.clearInterval(interval);
  }, [globeData]);

  useEffect(() => {
    if (!globeRef.current) return;
    const material = globeRef.current.globeMaterial() as unknown as { color: Color; emissive: Color; emissiveIntensity: number; shininess: number };
    material.color = new Color(config.globeColor);
    material.emissive = new Color(config.emissive);
    material.emissiveIntensity = config.emissiveIntensity;
    material.shininess = config.shininess;
  }, [config.emissive, config.emissiveIntensity, config.globeColor, config.shininess]);

  return <threeGlobe ref={globeRef} />;
}

function RendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

export function World({ globeConfig, data }: WorldProps) {
  const scene = new Scene();
  scene.fog = new Fog(0x000000, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, ASPECT, 180, 1800)}>
      <RendererConfig />
      <ambientLight color={globeConfig.ambientLight ?? "#ffffff"} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight ?? "#ffffff"} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight ?? "#ffffff"} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight ?? "#ffffff"} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls enablePan={false} enableZoom={false} minDistance={CAMERA_Z} maxDistance={CAMERA_Z} autoRotate autoRotateSpeed={0.65} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI - Math.PI / 3} />
    </Canvas>
  );
}
