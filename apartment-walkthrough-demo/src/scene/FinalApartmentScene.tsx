import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrthographicCamera, PerspectiveCamera, RoundedBox, SoftShadows, Text, useGLTF, useTexture } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, SSAO, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  apartmentBounds,
  doorMarkers,
  rooms,
  WALL_HEIGHT,
  wallSegments,
  windowSegments,
  type DoorMarker,
  type FloorKind,
  type Room,
  type WallKind,
  type WallSegment,
  type WindowSegment,
} from "./layout";

declare global {
  interface Window {
    __APARTMENT_SCENE_READY?: boolean;
    __setApartmentCaptureTime?: (timeMs: number) => void;
  }
}

export const WALKTHROUGH_DURATION_SECONDS = 116;
const CAMERA_HEIGHT = 5.25;
const DOOR_HEIGHT = 7.08;
const INTERIOR_WALL_THICKNESS = 0.52;
const EXTERIOR_WALL_THICKNESS = 0.68;

type SceneMode = "debug" | "walkthrough";
type ViewType = "top" | "perspective";
type Vec3 = [number, number, number];
type SegmentSpec = { id?: string; x1: number; z1: number; x2: number; z2: number };
type CameraKeyframe = { t: number; position: Vec3; target: Vec3; fov?: number; label?: string };
type CheckpointView = {
  title: string;
  type: ViewType;
  position: Vec3;
  target: Vec3;
  zoom?: number;
  fov?: number;
};

const viewMap: Record<string, CheckpointView> = {
  top: {
    title: "Top-down debug layout",
    type: "top",
    position: [apartmentBounds.centerX, 78, apartmentBounds.centerZ],
    target: [apartmentBounds.centerX, 0, apartmentBounds.centerZ],
    zoom: 21,
  },
  foyer: { title: "Foyer", type: "perspective", position: [33.1, 5.25, -0.95], target: [32.15, 3.45, 7.25], fov: 58 },
  living: { title: "Dining / Living", type: "perspective", position: [24.2, 5.25, 18.5], target: [30.4, 3.55, 31.8], fov: 59 },
  kitchen: { title: "Kitchen", type: "perspective", position: [25.9, 5.25, 7.35], target: [22.7, 3.35, 0.75], fov: 59 },
  "living-balcony": { title: "Living Balcony", type: "perspective", position: [31.85, 5.25, 41.2], target: [26.1, 3.45, 42.25], fov: 64 },
  bedroom1: { title: "Bedroom 1", type: "perspective", position: [39.3, 5.25, 27.6], target: [43.1, 3.35, 35.8], fov: 58 },
  bedroom2: { title: "Bedroom 2", type: "perspective", position: [15.2, 5.25, 28.8], target: [19.2, 3.35, 36.5], fov: 58 },
  master: { title: "Master Bedroom", type: "perspective", position: [9.2, 5.25, 23.2], target: [3.6, 3.45, 31.3], fov: 58 },
  "master-balcony": { title: "Master Balcony", type: "perspective", position: [8.9, 5.25, 36.6], target: [2.2, 3.45, 37.3], fov: 63 },
};

const finalRoute: CameraKeyframe[] = [
  { t: 0, position: [33.1, CAMERA_HEIGHT, -1.2], target: [33.05, 3.75, 6.5], fov: 64, label: "Foyer" },
  { t: 7, position: [33.1, CAMERA_HEIGHT, 3.9], target: [31.4, 3.65, 9.1], fov: 62, label: "Foyer" },
  { t: 13, position: [31.2, CAMERA_HEIGHT, 8.1], target: [24.8, 3.7, 13.8], fov: 61, label: "Dining" },
  { t: 20, position: [25.5, CAMERA_HEIGHT, 12.8], target: [23.5, 3.55, 14.4], fov: 59, label: "Dining" },
  { t: 27, position: [23.6, CAMERA_HEIGHT, 15.5], target: [29.2, 3.6, 24.2], fov: 59, label: "Dining" },
  { t: 35, position: [28.6, CAMERA_HEIGHT, 24.5], target: [30.2, 3.55, 32.6], fov: 60, label: "Living Room" },
  { t: 43, position: [29.0, CAMERA_HEIGHT, 31.2], target: [29.6, 3.5, 35.4], fov: 60, label: "Living Room" },
  { t: 43.25, position: [31.85, CAMERA_HEIGHT, 41.2], target: [26.1, 3.45, 42.25], fov: 64, label: "Balcony" },
  { t: 49.7, position: [29.6, CAMERA_HEIGHT, 41.45], target: [25.8, 3.45, 42.3], fov: 63, label: "Balcony" },
  { t: 50, position: [29.6, CAMERA_HEIGHT, 41.45], target: [25.8, 3.45, 42.3], fov: 63, label: "Balcony" },
  { t: 50.25, position: [25.8, CAMERA_HEIGHT, 8.2], target: [22.7, 3.4, 0.9], fov: 60, label: "Kitchen" },
  { t: 58, position: [24.4, CAMERA_HEIGHT, 8.6], target: [22.1, 3.35, 3.1], fov: 59, label: "Kitchen" },
  { t: 65, position: [21.2, CAMERA_HEIGHT, 5.0], target: [18.2, 3.45, 4.4], fov: 61, label: "Kitchen" },
  { t: 68.5, position: [17.4, CAMERA_HEIGHT, 4.4], target: [15.0, 3.4, 4.1], fov: 62, label: "Utility" },
  { t: 72, position: [15.35, CAMERA_HEIGHT, 4.0], target: [15.2, 3.45, 7.1], fov: 62, label: "Utility" },
  { t: 72.25, position: [35.4, CAMERA_HEIGHT, 22.1], target: [41.2, 3.55, 31.6], fov: 61, label: "Bedroom 1" },
  { t: 80, position: [39.6, CAMERA_HEIGHT, 28.2], target: [42.8, 3.45, 34.8], fov: 59, label: "Bedroom 1" },
  { t: 86.5, position: [42.1, CAMERA_HEIGHT, 30.2], target: [43.2, 3.35, 21.2], fov: 61, label: "Bedroom 1" },
  { t: 91.7, position: [43.1, CAMERA_HEIGHT, 20.9], target: [45.2, 3.35, 20.7], fov: 64, label: "Attached Toilet" },
  { t: 92, position: [43.1, CAMERA_HEIGHT, 20.9], target: [45.2, 3.35, 20.7], fov: 64, label: "Attached Toilet" },
  { t: 92.25, position: [17.9, CAMERA_HEIGHT, 27.8], target: [18.2, 3.45, 36.4], fov: 60, label: "Bedroom 2" },
  { t: 100, position: [18.2, CAMERA_HEIGHT, 31.2], target: [18.1, 3.45, 36.6], fov: 58, label: "Bedroom 2" },
  { t: 102, position: [18.2, CAMERA_HEIGHT, 31.2], target: [18.1, 3.45, 36.6], fov: 58, label: "Bedroom 2" },
  { t: 102.25, position: [16.2, CAMERA_HEIGHT, 11.5], target: [12.3, 3.35, 11.4], fov: 63, label: "Common Toilet" },
  { t: 106.5, position: [13.4, CAMERA_HEIGHT, 11.5], target: [10.0, 3.35, 11.4], fov: 62, label: "Common Toilet" },
  { t: 107, position: [13.4, CAMERA_HEIGHT, 11.5], target: [10.0, 3.35, 11.4], fov: 62, label: "Common Toilet" },
  { t: 107.25, position: [10.3, CAMERA_HEIGHT, 22.4], target: [5.4, 3.55, 29.2], fov: 61, label: "Master Bedroom" },
  { t: 111.8, position: [6.5, CAMERA_HEIGHT, 27.2], target: [3.6, 3.45, 31.6], fov: 59, label: "Master Bedroom" },
  { t: 112, position: [6.5, CAMERA_HEIGHT, 27.2], target: [3.6, 3.45, 31.6], fov: 59, label: "Master Bedroom" },
  { t: 112.25, position: [6.5, CAMERA_HEIGHT, 19.0], target: [4.35, 3.35, 17.25], fov: 64, label: "Master Toilet" },
  { t: 114, position: [6.2, CAMERA_HEIGHT, 18.6], target: [3.5, 3.35, 17.2], fov: 64, label: "Master Toilet" },
  { t: 114.25, position: [5.9, CAMERA_HEIGHT, 33.2], target: [5.8, 3.6, 37.7], fov: 62, label: "Master Balcony" },
  { t: 116, position: [5.7, CAMERA_HEIGHT, 35.8], target: [5.7, 3.6, 38.1], fov: 63, label: "Master Balcony" },
];

const labelWindows = [
  { label: "Foyer", start: 0, end: 12 },
  { label: "Dining", start: 13, end: 28 },
  { label: "Living Room", start: 30, end: 43 },
  { label: "Balcony", start: 43.3, end: 50 },
  { label: "Kitchen", start: 50.3, end: 66 },
  { label: "Utility", start: 66.5, end: 72 },
  { label: "Bedroom 1", start: 72.4, end: 88 },
  { label: "Bedroom 2", start: 92.4, end: 102 },
  { label: "Master Bedroom", start: 107.3, end: 112 },
  { label: "Master Toilet", start: 112.3, end: 114 },
  { label: "Master Balcony", start: 114, end: 116 },
];

const cutTimes = [43.12, 50.12, 72.12, 92.12, 102.12, 107.12, 112.12, 114.12];

const mats = {
  wall: { color: "#d9cdbb", roughness: 0.86, metalness: 0.01 },
  exteriorWall: { color: "#d1c2ae", roughness: 0.86, metalness: 0.01 },
  baseboard: { color: "#c4b6a4", roughness: 0.72, metalness: 0.02 },
  ceiling: { color: "#efe6d7", roughness: 0.72, metalness: 0.01 },
  warmTile: { color: "#d0c5b4", roughness: 0.68, metalness: 0.01 },
  bedroomWood: { color: "#c0905d", roughness: 0.58, metalness: 0.02 },
  deck: { color: "#9c8466", roughness: 0.62, metalness: 0.02 },
  walnut: { color: "#6d4730", roughness: 0.52, metalness: 0.03 },
  oak: { color: "#b8895e", roughness: 0.55, metalness: 0.02 },
  charcoal: { color: "#2d2c29", roughness: 0.54, metalness: 0.08 },
  black: { color: "#111111", roughness: 0.5, metalness: 0.18 },
  bronze: { color: "#9f7a4b", roughness: 0.34, metalness: 0.55 },
  champagne: { color: "#d1b780", roughness: 0.28, metalness: 0.55 },
  ivory: { color: "#e2d6c4", roughness: 0.76, metalness: 0.02 },
  stone: { color: "#c9b89f", roughness: 0.54, metalness: 0.04 },
  marble: { color: "#d8c8b2", roughness: 0.42, metalness: 0.06 },
  fabric: { color: "#c3ad94", roughness: 0.9, metalness: 0 },
  taupe: { color: "#ab9a88", roughness: 0.88, metalness: 0 },
  olive: { color: "#7c8062", roughness: 0.84, metalness: 0 },
  rust: { color: "#9d5b3d", roughness: 0.82, metalness: 0 },
  linen: { color: "#dbcebb", roughness: 0.92, metalness: 0 },
  wetTile: { color: "#c9c0b5", roughness: 0.58, metalness: 0.02 },
  greenery: { color: "#3f5d38", roughness: 0.78, metalness: 0 },
  mirror: { color: "#c9d2d1", roughness: 0.18, metalness: 0.72 },
  emissiveWarm: { color: "#caa868", emissive: "#a36a2a", emissiveIntensity: 0.08, roughness: 0.58 },
};

const floorColors: Record<FloorKind, keyof typeof mats> = {
  common: "warmTile",
  bedroom: "bedroomWood",
  wet: "wetTile",
  balcony: "deck",
  passage: "warmTile",
};

const pbrTextures = {
  wall: {
    diff: new URL("../assets/pbr/beige_wall_001/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/beige_wall_001/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/beige_wall_001/rough.jpg", import.meta.url).href,
    repeat: [2.1, 1.5] as const,
  },
  exteriorWall: {
    diff: new URL("../assets/pbr/beige_wall_001/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/beige_wall_001/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/beige_wall_001/rough.jpg", import.meta.url).href,
    repeat: [2.0, 1.6] as const,
  },
  ceiling: {
    diff: new URL("../assets/pbr/beige_wall_001/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/beige_wall_001/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/beige_wall_001/rough.jpg", import.meta.url).href,
    repeat: [1.8, 1.8] as const,
  },
  wetTile: {
    diff: new URL("../assets/pbr/large_grey_tiles/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/large_grey_tiles/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/large_grey_tiles/rough.jpg", import.meta.url).href,
    repeat: [1.4, 1.4] as const,
  },
  bedroomWood: {
    diff: new URL("../assets/pbr/laminate_floor_02/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/laminate_floor_02/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/laminate_floor_02/rough.jpg", import.meta.url).href,
    repeat: [1.6, 2.4] as const,
  },
  deck: {
    diff: new URL("../assets/pbr/wood_floor_deck/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/wood_floor_deck/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/wood_floor_deck/rough.jpg", import.meta.url).href,
    repeat: [1.0, 1.75] as const,
  },
  oak: {
    diff: new URL("../assets/pbr/oak_veneer_01/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/oak_veneer_01/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/oak_veneer_01/rough.jpg", import.meta.url).href,
    repeat: [1.6, 1.0] as const,
  },
  walnut: {
    diff: new URL("../assets/pbr/wooden_panels/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/wooden_panels/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/wooden_panels/rough.jpg", import.meta.url).href,
    repeat: [1.25, 1.0] as const,
  },
  stone: {
    diff: new URL("../assets/pbr/marble_01/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/marble_01/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/marble_01/rough.jpg", import.meta.url).href,
    repeat: [1.3, 1.3] as const,
  },
  marble: {
    diff: new URL("../assets/pbr/marble_01/diff.jpg", import.meta.url).href,
    normal: new URL("../assets/pbr/marble_01/nor.jpg", import.meta.url).href,
    rough: new URL("../assets/pbr/marble_01/rough.jpg", import.meta.url).href,
    repeat: [1.1, 1.1] as const,
  },
} satisfies Partial<Record<keyof typeof mats, { diff: string; normal: string; rough: string; repeat: readonly [number, number] }>>;

const hdriUrl = new URL("../assets/pbr/hdri/canary_wharf.hdr", import.meta.url).href;
const cityBackdropUrl = new URL("../assets/pbr/hdri/canary_wharf.jpg", import.meta.url).href;

const modelUrls = {
  coffeeMug: new URL("../assets/models/CoffeeMug.glb", import.meta.url).href,
  jar: new URL("../assets/models/Jar.glb", import.meta.url).href,
  lampStand: new URL("../assets/models/Lamp_Stand.glb", import.meta.url).href,
  potPlant: new URL("../assets/models/Pot_Plant.glb", import.meta.url).href,
  tableLamp: new URL("../assets/models/TableLamp.glb", import.meta.url).href,
} satisfies Record<string, string>;

type ModelAsset = keyof typeof modelUrls;

const polyModelUrls = {
  modernArmChair: new URL("../assets/polyhaven/modern_arm_chair_01/modern_arm_chair_01_2k.gltf", import.meta.url).href,
  coffeeTable: new URL("../assets/polyhaven/modern_coffee_table_01/modern_coffee_table_01_2k.gltf", import.meta.url).href,
  sideTable: new URL("../assets/polyhaven/side_table_01/side_table_01_2k.gltf", import.meta.url).href,
  tallSideTable: new URL("../assets/polyhaven/side_table_tall_01/side_table_tall_01_2k.gltf", import.meta.url).href,
  nightstand: new URL("../assets/polyhaven/ClassicNightstand_01/ClassicNightstand_01_2k.gltf", import.meta.url).href,
  cabinet: new URL("../assets/polyhaven/modern_wooden_cabinet/modern_wooden_cabinet_2k.gltf", import.meta.url).href,
  shelves: new URL("../assets/polyhaven/painted_wooden_shelves/painted_wooden_shelves_2k.gltf", import.meta.url).href,
  pottedPlant1: new URL("../assets/polyhaven/potted_plant_01/potted_plant_01_2k.gltf", import.meta.url).href,
  pottedPlant2: new URL("../assets/polyhaven/potted_plant_02/potted_plant_02_2k.gltf", import.meta.url).href,
  pottedPlant4: new URL("../assets/polyhaven/potted_plant_04/potted_plant_04_2k.gltf", import.meta.url).href,
  pachira: new URL("../assets/polyhaven/pachira_aquatica_01/pachira_aquatica_01_2k.gltf", import.meta.url).href,
} satisfies Record<string, string>;

type PolyAsset = keyof typeof polyModelUrls;

const wallColors: Record<WallKind, keyof typeof mats> = {
  exterior: "exteriorWall",
  interior: "wall",
  railing: "charcoal",
};

function matProps(name: keyof typeof mats) {
  return mats[name];
}

const planZToWorld = (z: number) => apartmentBounds.maxZ - z;
const planPointToWorld = ([x, y, z]: Vec3) => new THREE.Vector3(x, y, planZToWorld(z));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

function segmentWorldData(segment: SegmentSpec) {
  const z1 = planZToWorld(segment.z1);
  const z2 = planZToWorld(segment.z2);
  const dx = segment.x2 - segment.x1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  return { center: [(segment.x1 + segment.x2) / 2, (z1 + z2) / 2] as const, length, angle };
}

function getDebugView() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("view") ?? "foyer";
  return viewMap[key] ?? viewMap.foyer;
}

function getStandaloneWalkthroughTime() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("walkthrough") !== "1") return null;
  const parsed = Number(params.get("t") ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getIsCaptureMode() {
  return new URLSearchParams(window.location.search).get("capture") === "1";
}

function sampleCameraRoute(timeSeconds: number) {
  const clamped = THREE.MathUtils.clamp(timeSeconds, 0, WALKTHROUGH_DURATION_SECONDS);
  const nextIndex = finalRoute.findIndex((point) => point.t >= clamped);
  const index = Math.max(1, nextIndex === -1 ? finalRoute.length - 1 : nextIndex);
  const previous = finalRoute[index - 1];
  const next = finalRoute[index];
  const local = previous.t === next.t ? 0 : (clamped - previous.t) / (next.t - previous.t);
  const eased = smoothstep(THREE.MathUtils.clamp(local, 0, 1));

  const target = planPointToWorld(previous.target).lerp(planPointToWorld(next.target), eased);
  target.y = THREE.MathUtils.clamp(target.y + 0.72, 4.08, 4.72);

  return {
    position: planPointToWorld(previous.position).lerp(planPointToWorld(next.position), eased),
    target,
    fov: THREE.MathUtils.lerp(previous.fov ?? 62, next.fov ?? 62, eased),
  };
}

function currentRoomLabel(timeSeconds: number) {
  const active = labelWindows.find(({ start, end }) => timeSeconds >= start && timeSeconds <= end);
  if (!active) return { label: "", opacity: 0 };
  const fadeIn = THREE.MathUtils.clamp((timeSeconds - active.start) / 1.2, 0, 1);
  const fadeOut = THREE.MathUtils.clamp((active.end - timeSeconds) / 1.2, 0, 1);
  return { label: active.label, opacity: Math.min(fadeIn, fadeOut) * 0.82 };
}

function StaticCamera({ view }: { view: CheckpointView }) {
  const perspectiveRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicRef = useRef<THREE.OrthographicCamera>(null);
  const position = planPointToWorld(view.position);

  useEffect(() => {
    const camera = view.type === "top" ? orthographicRef.current : perspectiveRef.current;
    if (!camera) return;
    camera.up.set(0, view.type === "top" ? 0 : 1, view.type === "top" ? -1 : 0);
    camera.lookAt(planPointToWorld(view.target));
    camera.updateProjectionMatrix();
  }, [view]);

  if (view.type === "top") {
    return <OrthographicCamera ref={orthographicRef} makeDefault position={position} zoom={view.zoom} near={0.1} far={200} />;
  }
  return <PerspectiveCamera ref={perspectiveRef} makeDefault position={position} fov={view.fov} near={0.1} far={220} />;
}

function applyWalkthroughCamera(camera: THREE.Camera, timeMs: number) {
    const { position, target, fov } = sampleCameraRoute(timeMs / 1000);
    camera.position.copy(position);
    camera.up.set(0, 1, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.near = 0.12;
      camera.far = 220;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(target);
}

function WalkthroughCamera({ timeMs }: { timeMs: number }) {
  const { camera, invalidate } = useThree();

  useFrame(() => {
    applyWalkthroughCamera(camera, timeMs);
  });

  useLayoutEffect(() => {
    applyWalkthroughCamera(camera, timeMs);
    invalidate();
  }, [camera, invalidate, timeMs]);

  return null;
}

function SceneReadySignal() {
  const frameCount = useRef(0);

  useEffect(() => {
    window.__APARTMENT_SCENE_READY = false;
  }, []);

  useFrame(({ gl }) => {
    frameCount.current += 1;
    if (frameCount.current < 4 || window.__APARTMENT_SCENE_READY) return;
    gl.getContext().finish();
    window.__APARTMENT_SCENE_READY = true;
  });

  return null;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.split("").map((part) => part + part).join("") : clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgba(hex: string, alpha: number, lift = 0) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.min(255, Math.max(0, r + lift))}, ${Math.min(255, Math.max(0, g + lift))}, ${Math.min(255, Math.max(0, b + lift))}, ${alpha})`;
}

function makeMaterialTexture(name: keyof typeof mats, color: string) {
  if (typeof document === "undefined") return null;
  if (["black", "bronze", "champagne", "mirror", "emissiveWarm", "greenery"].includes(name)) return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const seed = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const random = (index: number) => {
    const x = Math.sin(index * 91.17 + seed * 13.37) * 10000;
    return x - Math.floor(x);
  };

  if (["walnut", "oak", "bedroomWood"].includes(name)) {
    for (let y = 0; y < 256; y += 9) {
      const lift = random(y) * 28 - 12;
      ctx.fillStyle = rgba(color, 0.26, lift);
      ctx.fillRect(0, y + random(y + 1) * 3, 256, 2 + random(y + 2) * 2);
    }
    for (let i = 0; i < 52; i += 1) {
      ctx.strokeStyle = rgba("#2d1d13", 0.13 + random(i) * 0.08);
      ctx.lineWidth = 1;
      ctx.beginPath();
      const y = random(i + 8) * 256;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(64, y + random(i + 9) * 20 - 10, 150, y + random(i + 10) * 22 - 11, 256, y + random(i + 11) * 18 - 9);
      ctx.stroke();
    }
  } else if (name === "warmTile") {
    const tileSize = 128;
    for (let tileY = 0; tileY < 2; tileY += 1) {
      for (let tileX = 0; tileX < 2; tileX += 1) {
        const lift = random(tileX * 10 + tileY) * 14 - 4;
        const gradient = ctx.createLinearGradient(tileX * tileSize, tileY * tileSize, (tileX + 1) * tileSize, (tileY + 1) * tileSize);
        gradient.addColorStop(0, rgba(color, 0.96, lift + 7));
        gradient.addColorStop(1, rgba(color, 0.96, lift - 5));
        ctx.fillStyle = gradient;
        ctx.fillRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);
      }
    }
    for (let i = 0; i < 170; i += 1) {
      ctx.fillStyle = rgba(random(i) > 0.54 ? "#ffffff" : "#6b5d4d", 0.018 + random(i + 1) * 0.024);
      ctx.fillRect(random(i + 2) * 256, random(i + 3) * 256, 1 + random(i + 4) * 8, 1);
    }
    ctx.strokeStyle = rgba("#efe6d8", 0.42);
    ctx.lineWidth = 3;
    [0, 128, 256].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line, 0);
      ctx.lineTo(line, 256);
      ctx.moveTo(0, line);
      ctx.lineTo(256, line);
      ctx.stroke();
    });
    ctx.strokeStyle = rgba("#8b7d6d", 0.12);
    ctx.lineWidth = 1;
    [128].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line, 0);
      ctx.lineTo(line, 256);
      ctx.moveTo(0, line);
      ctx.lineTo(256, line);
      ctx.stroke();
    });
  } else if (["wetTile", "stone", "marble"].includes(name)) {
    for (let i = 0; i < 90; i += 1) {
      ctx.fillStyle = rgba(random(i) > 0.5 ? "#ffffff" : "#5a4d40", 0.025 + random(i + 1) * 0.045);
      ctx.fillRect(random(i + 2) * 256, random(i + 3) * 256, 2 + random(i + 4) * 22, 1 + random(i + 5) * 3);
    }
    if (name === "marble" || name === "stone") {
      for (let i = 0; i < 18; i += 1) {
        ctx.strokeStyle = rgba("#6d5b4d", name === "marble" ? 0.12 : 0.08);
        ctx.lineWidth = 1 + random(i) * 1.6;
        ctx.beginPath();
        const start = random(i + 20) * 256;
        ctx.moveTo(-20, start);
        ctx.bezierCurveTo(60, start - 30 + random(i + 21) * 60, 150, start + random(i + 22) * 45, 280, start - 20 + random(i + 23) * 50);
        ctx.stroke();
      }
    }
    if (name === "wetTile") {
      ctx.strokeStyle = rgba("#efe4d4", 0.34);
      ctx.lineWidth = 2;
      [0, 128, 256].forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line, 0);
        ctx.lineTo(line, 256);
        ctx.moveTo(0, line);
        ctx.lineTo(256, line);
        ctx.stroke();
      });
    }
  } else {
    for (let i = 0; i < 420; i += 1) {
      const lift = random(i) * 34 - 12;
      ctx.fillStyle = rgba(color, 0.055, lift);
      ctx.fillRect(random(i + 1) * 256, random(i + 2) * 256, 1 + random(i + 3) * 2, 1 + random(i + 4) * 2);
    }
    if (["fabric", "taupe", "linen", "olive", "rust"].includes(name)) {
      ctx.strokeStyle = rgba("#ffffff", 0.09);
      ctx.lineWidth = 1;
      for (let line = 0; line < 256; line += 12) {
        ctx.beginPath();
        ctx.moveTo(0, line);
        ctx.lineTo(256, line);
        ctx.moveTo(line, 0);
        ctx.lineTo(line, 256);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(name === "warmTile" ? 1.05 : ["wall", "exteriorWall"].includes(name) ? 3.5 : 1.6, name === "warmTile" ? 1.05 : ["wall", "exteriorWall"].includes(name) ? 2.4 : 1.6);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function TexturedMaterial({
  name,
  textureSpec,
}: {
  name: keyof typeof mats;
  textureSpec: (typeof pbrTextures)[keyof typeof pbrTextures];
}) {
  const props = matProps(name);
  const textures = useTexture({
    map: textureSpec.diff,
    normalMap: textureSpec.normal,
    roughnessMap: textureSpec.rough,
  });

  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(textureSpec.repeat[0], textureSpec.repeat[1]);
      texture.anisotropy = 8;
      texture.colorSpace = texture === textures.map ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.needsUpdate = true;
    });
  }, [textureSpec.repeat, textures]);

  const normalStrength = name === "warmTile" ? 0.16 : name === "wetTile" || name === "stone" || name === "marble" ? 0.25 : 0.42;
  const roughnessMap = name === "warmTile" ? undefined : textures.roughnessMap;

  return (
    <meshStandardMaterial
      {...props}
      map={textures.map}
      normalMap={textures.normalMap}
      roughnessMap={roughnessMap}
      roughness={name === "warmTile" ? 0.88 : "roughness" in props ? props.roughness : 0.65}
      normalScale={new THREE.Vector2(normalStrength, normalStrength)}
    />
  );
}

function Material({ name }: { name: keyof typeof mats }) {
  const textureSpec = pbrTextures[name as keyof typeof pbrTextures];
  if (textureSpec) return <TexturedMaterial name={name} textureSpec={textureSpec} />;
  const props = matProps(name);
  const color = "color" in props ? props.color : "#ffffff";
  const map = useMemo(() => makeMaterialTexture(name, color), [color, name]);
  const bumpScale = name === "warmTile" ? 0.0035 : ["fabric", "taupe", "linen", "olive", "rust"].includes(name) ? 0.018 : ["wall", "exteriorWall"].includes(name) ? 0.01 : 0.006;
  return <meshStandardMaterial {...props} map={map ?? undefined} bumpMap={map ?? undefined} bumpScale={map ? bumpScale : undefined} />;
}

function PlanGroup({
  x,
  z,
  y = 0,
  rotation = 0,
  children,
}: {
  x: number;
  z: number;
  y?: number;
  rotation?: number;
  children: React.ReactNode;
}) {
  return (
    <group position={[x, y, planZToWorld(z)]} rotation={[0, -rotation, 0]}>
      {children}
    </group>
  );
}

function LocalBox({
  position,
  size,
  mat,
  rounded = false,
  radius = 0.08,
  castShadow = true,
  receiveShadow = true,
}: {
  position: Vec3;
  size: Vec3;
  mat: keyof typeof mats;
  rounded?: boolean;
  radius?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const meshPosition: Vec3 = [position[0], position[1] + size[1] / 2, position[2]];
  if (rounded) {
    return (
      <RoundedBox args={size} radius={radius} smoothness={5} position={meshPosition} castShadow={castShadow} receiveShadow={receiveShadow}>
        <Material name={mat} />
      </RoundedBox>
    );
  }
  return (
    <mesh position={meshPosition} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <Material name={mat} />
    </mesh>
  );
}

function PlanBox({
  x,
  z,
  y = 0,
  size,
  mat,
  rotation = 0,
  rounded = false,
  radius,
  castShadow = true,
  receiveShadow = true,
}: {
  x: number;
  z: number;
  y?: number;
  size: Vec3;
  mat: keyof typeof mats;
  rotation?: number;
  rounded?: boolean;
  radius?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  return (
    <PlanGroup x={x} z={z} rotation={rotation}>
      <LocalBox position={[0, y, 0]} size={size} mat={mat} rounded={rounded} radius={radius} castShadow={castShadow} receiveShadow={receiveShadow} />
    </PlanGroup>
  );
}

function AssetModel({
  asset,
  scale = 1,
  castShadow = true,
}: {
  asset: ModelAsset;
  scale?: number | Vec3;
  castShadow?: boolean;
}) {
  const gltf = useGLTF(modelUrls[asset]) as { scene: THREE.Group };
  const clone = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            material.needsUpdate = true;
          });
        } else if (mesh.material) {
          mesh.material.needsUpdate = true;
        }
      }
    });
    return scene;
  }, [castShadow, gltf.scene]);

  return <primitive object={clone} scale={scale} />;
}

function PlanAsset({
  asset,
  x,
  z,
  y = 0,
  rotation = 0,
  scale = 1,
}: {
  asset: ModelAsset;
  x: number;
  z: number;
  y?: number;
  rotation?: number;
  scale?: number | Vec3;
}) {
  return (
    <PlanGroup x={x} z={z} y={y} rotation={rotation}>
      <AssetModel asset={asset} scale={scale} />
    </PlanGroup>
  );
}

function FittedAssetModel({
  asset,
  fit,
  castShadow = true,
}: {
  asset: PolyAsset;
  fit: Vec3;
  castShadow?: boolean;
}) {
  const gltf = useGLTF(polyModelUrls[asset]) as { scene: THREE.Group };
  const fitKey = fit.join(",");
  const normalized = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.roughness = Math.max(material.roughness ?? 0.55, 0.58);
              material.needsUpdate = true;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.roughness = Math.max(mesh.material.roughness ?? 0.55, 0.58);
          mesh.material.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = Math.min(
      fit[0] / Math.max(size.x, 0.001),
      fit[1] / Math.max(size.y, 0.001),
      fit[2] / Math.max(size.z, 0.001),
    );
    const offset = new THREE.Vector3(-center.x, -box.min.y, -center.z);
    return { scene, scale, offset };
  }, [asset, castShadow, fitKey, gltf.scene]);

  return (
    <group scale={normalized.scale}>
      <primitive object={normalized.scene} position={normalized.offset} />
    </group>
  );
}

function PlanFittedAsset({
  asset,
  x,
  z,
  y = 0,
  rotation = 0,
  fit,
}: {
  asset: PolyAsset;
  x: number;
  z: number;
  y?: number;
  rotation?: number;
  fit: Vec3;
}) {
  return (
    <PlanGroup x={x} z={z} y={y} rotation={rotation}>
      <FittedAssetModel asset={asset} fit={fit} />
    </PlanGroup>
  );
}

function LocalCylinder({
  position,
  radius = 0.25,
  depth = 0.5,
  mat,
  segments = 32,
}: {
  position: Vec3;
  radius?: number;
  depth?: number;
  mat: keyof typeof mats;
  segments?: number;
}) {
  return (
    <mesh position={[position[0], position[1] + depth / 2, position[2]]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, depth, segments]} />
      <Material name={mat} />
    </mesh>
  );
}

function GlowStrip({ position, size }: { position: Vec3; size: Vec3 }) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#caa868" emissive="#9a6528" emissiveIntensity={0.06} roughness={0.62} />
    </mesh>
  );
}

function TileLines({ room }: { room: Room }) {
  if (room.floor === "bedroom") {
    return (
      <>
        {Array.from({ length: Math.floor(room.width / 1.1) }).map((_, index) => {
          const x = room.x + 0.45 + index * 1.1;
          if (x > room.x + room.width - 0.3) return null;
          return <PlanBox key={`${room.id}-plank-${index}`} x={x} z={room.z + room.depth / 2} y={0.012} size={[0.025, 0.025, room.depth - 0.35]} mat="oak" />;
        })}
      </>
    );
  }
  const step = room.floor === "balcony" ? 1.1 : 3.2;
  return (
    <>
      {Array.from({ length: Math.floor(room.width / step) }).map((_, index) => {
        const x = room.x + step + index * step;
        if (x > room.x + room.width - 0.2) return null;
        return <PlanBox key={`${room.id}-tile-x-${index}`} x={x} z={room.z + room.depth / 2} y={0.015} size={[0.025, 0.026, room.depth]} mat="baseboard" />;
      })}
      {Array.from({ length: Math.floor(room.depth / step) }).map((_, index) => {
        const z = room.z + step + index * step;
        if (z > room.z + room.depth - 0.2) return null;
        return <PlanBox key={`${room.id}-tile-z-${index}`} x={room.x + room.width / 2} z={z} y={0.016} size={[room.width, 0.025, 0.025]} mat="baseboard" />;
      })}
    </>
  );
}

function FloorSlab({ room, showLabels }: { room: Room; showLabels: boolean }) {
  const centerX = room.x + room.width / 2;
  const centerZ = room.z + room.depth / 2;
  const label = showLabels && room.showLabel !== false ? room.label : null;
  return (
    <group>
      <PlanBox x={centerX} z={centerZ} y={-0.05} size={[room.width, 0.08, room.depth]} mat={floorColors[room.floor]} />
      {showLabels ? <TileLines room={room} /> : null}
      {label ? (
        <Text
          position={[centerX, 0.08, planZToWorld(centerZ)]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={label.length > 12 ? 0.65 : 0.78}
          anchorX="center"
          anchorY="middle"
          color="#312b25"
          outlineColor="#f5efe5"
          outlineWidth={0.035}
        >
          {label}
        </Text>
      ) : null}
    </group>
  );
}

function SegmentBox({
  segment,
  y,
  height,
  thickness,
  mat,
  opacity = 1,
}: {
  segment: SegmentSpec;
  y: number;
  height: number;
  thickness: number;
  mat: keyof typeof mats;
  opacity?: number;
}) {
  const { center, length, angle } = segmentWorldData(segment);
  return (
    <mesh position={[center[0], y, center[1]]} rotation={[0, -angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial {...matProps(mat)} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function GlassRailing({ segment }: { segment: WallSegment }) {
  const { center, length, angle } = segmentWorldData(segment);
  const postCount = Math.max(2, Math.floor(length / 3) + 1);
  return (
    <group position={[center[0], 0, center[1]]} rotation={[0, -angle, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 2.7, 0.08]} />
        <meshPhysicalMaterial color="#c6dde0" roughness={0.08} transparent opacity={0.34} transmission={0.22} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[length + 0.18, 0.12, 0.2]} />
        <Material name="black" />
      </mesh>
      {Array.from({ length: postCount }).map((_, index) => (
        <mesh key={`${segment.id}-post-${index}`} position={[-length / 2 + (index / (postCount - 1)) * length, 1.5, 0]}>
          <boxGeometry args={[0.1, 3, 0.18]} />
          <Material name="black" />
        </mesh>
      ))}
    </group>
  );
}

function Wall({ segment }: { segment: WallSegment }) {
  if (segment.kind === "railing") return <GlassRailing segment={segment} />;
  const kind = segment.kind ?? "interior";
  const thickness = kind === "exterior" ? EXTERIOR_WALL_THICKNESS : INTERIOR_WALL_THICKNESS;
  const height = segment.height ?? WALL_HEIGHT;
  return (
    <group>
      <SegmentBox segment={segment} y={height / 2} height={height} thickness={thickness} mat={wallColors[kind]} />
      <SegmentBox segment={segment} y={0.22} height={0.34} thickness={thickness + 0.08} mat="baseboard" />
      <SegmentBox segment={segment} y={height + 0.04} height={0.08} thickness={thickness + 0.06} mat="baseboard" />
    </group>
  );
}

function GlassPanel({ segment }: { segment: WindowSegment }) {
  const isSlider = segment.id.includes("slider");
  const { center, length, angle } = segmentWorldData(segment);
  const sill = isSlider ? 0.22 : segment.sill ?? 2.5;
  const height = isSlider ? 8.35 : segment.height ?? 5.25;
  return (
    <group position={[center[0], sill + height / 2, center[1]]} rotation={[0, -angle, 0]}>
      <mesh castShadow>
        <boxGeometry args={[length, height, 0.06]} />
        <meshPhysicalMaterial color="#c5dde1" roughness={0.04} transparent opacity={0.28} transmission={0.36} />
      </mesh>
      <LocalBox position={[0, height / 2, 0]} size={[length + 0.26, 0.13, 0.16]} mat="black" />
      <LocalBox position={[0, -height / 2 - 0.13, 0]} size={[length + 0.26, 0.13, 0.16]} mat="black" />
      <LocalBox position={[-length / 2 - 0.08, -height / 2, 0]} size={[0.14, height + 0.26, 0.16]} mat="black" />
      <LocalBox position={[length / 2 - 0.06, -height / 2, 0]} size={[0.14, height + 0.26, 0.16]} mat="black" />
      <LocalBox position={[0, -height / 2, 0.01]} size={[0.09, height, 0.16]} mat="black" />
      {isSlider ? (
        <>
          <LocalBox position={[-length * 0.22, -height / 2 + 0.28, 0.07]} size={[length * 0.36, 0.06, 0.12]} mat="champagne" />
          <LocalBox position={[length * 0.22, -height / 2 + 0.42, -0.07]} size={[length * 0.36, 0.06, 0.12]} mat="champagne" />
        </>
      ) : null}
    </group>
  );
}

function DaylightPanel({ segment }: { segment: WindowSegment }) {
  const isSlider = segment.id.includes("slider");
  const { center, length, angle } = segmentWorldData(segment);
  const sill = isSlider ? 0.22 : segment.sill ?? 2.5;
  const height = isSlider ? 8.25 : segment.height ?? 5.25;
  return (
    <group position={[center[0], sill + height / 2, center[1]]} rotation={[0, -angle, 0]}>
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[length * 0.96, height * 0.92, 0.035]} />
        <meshBasicMaterial color="#fff1d6" transparent opacity={isSlider ? 0.22 : 0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {isSlider ? <pointLight position={[0, -1.25, -1.2]} intensity={0.34} distance={10} color="#fff0d8" /> : null}
    </group>
  );
}

const doorFrameAxes: Record<string, "x" | "z"> = {
  "main-door": "x",
  "foyer-door": "x",
  "utility-door": "z",
  "common-toilet-door": "z",
  "master-door": "z",
  "master-toilet-door": "x",
  "bedroom2-door": "x",
  "bedroom1-entry": "z",
  "bedroom1-door": "x",
  "bedroom1-toilet-door": "z",
};

function DoorFrame({ door, showDebugSwing }: { door: DoorMarker; showDebugSwing: boolean }) {
  const axis = doorFrameAxes[door.id] ?? "x";
  const half = door.width / 2;
  const segment =
    axis === "x"
      ? { x1: door.x - half, z1: door.z, x2: door.x + half, z2: door.z }
      : { x1: door.x, z1: door.z - half, x2: door.x, z2: door.z + half };
  const { center, length, angle } = segmentWorldData(segment);
  return (
    <group position={[center[0], 0, center[1]]} rotation={[0, -angle, 0]}>
      <LocalBox position={[-length / 2 - 0.08, 0, 0]} size={[0.14, DOOR_HEIGHT, 0.28]} mat="walnut" />
      <LocalBox position={[length / 2 + 0.08, 0, 0]} size={[0.14, DOOR_HEIGHT, 0.28]} mat="walnut" />
      <LocalBox position={[0, DOOR_HEIGHT, 0]} size={[length + 0.34, 0.22, 0.32]} mat="walnut" />
      <LocalBox position={[0, 0, 0]} size={[length + 0.22, 0.12, 0.26]} mat="stone" />
      {showDebugSwing ? <LocalBox position={[length * 0.25, 0.08, 0]} size={[length * 0.5, 0.08, 0.16]} mat="oak" /> : null}
    </group>
  );
}

function Downlight({ x, z, intensity = 0.08 }: { x: number; z: number; intensity?: number }) {
  return (
    <PlanGroup x={x} z={z}>
      <mesh position={[0, WALL_HEIGHT - 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 28]} />
        <meshStandardMaterial color="#f3dfbd" emissive="#d39a47" emissiveIntensity={0.28} roughness={0.52} />
      </mesh>
      <pointLight position={[0, WALL_HEIGHT - 0.55, 0]} intensity={intensity} distance={5.5} color="#ffd9a4" />
    </PlanGroup>
  );
}

function CeilingBands({ fullCeilings = true }: { fullCeilings?: boolean }) {
  const band = 0.62;
  return (
    <>
      {rooms
        .filter((room) => room.floor !== "balcony" && room.showLabel !== false)
        .map((room) => (
          <group key={`${room.id}-ceiling`}>
            {fullCeilings ? (
              <>
                <PlanBox x={room.x + room.width / 2} z={room.z + room.depth / 2} y={WALL_HEIGHT - 0.1} size={[room.width, 0.08, room.depth]} mat="ceiling" castShadow={false} />
                <PlanBox
                  x={room.x + room.width / 2}
                  z={room.z + room.depth / 2}
                  y={WALL_HEIGHT - 0.23}
                  size={[Math.max(0.2, room.width - 1.35), 0.06, Math.max(0.2, room.depth - 1.35)]}
                  mat="ceiling"
                  castShadow={false}
                />
                <Downlight x={room.x + room.width * 0.32} z={room.z + room.depth * 0.34} intensity={room.id.includes("toilet") ? 0.06 : 0.085} />
                <Downlight x={room.x + room.width * 0.68} z={room.z + room.depth * 0.66} intensity={room.id.includes("toilet") ? 0.055 : 0.075} />
              </>
            ) : null}
            <PlanBox x={room.x + room.width / 2} z={room.z + band / 2} y={WALL_HEIGHT - 0.05} size={[room.width, 0.12, band]} mat="ceiling" castShadow={false} />
            <PlanBox x={room.x + room.width / 2} z={room.z + room.depth - band / 2} y={WALL_HEIGHT - 0.05} size={[room.width, 0.12, band]} mat="ceiling" castShadow={false} />
            <PlanBox x={room.x + band / 2} z={room.z + room.depth / 2} y={WALL_HEIGHT - 0.04} size={[band, 0.12, Math.max(0.1, room.depth - band * 2)]} mat="ceiling" castShadow={false} />
            <PlanBox x={room.x + room.width - band / 2} z={room.z + room.depth / 2} y={WALL_HEIGHT - 0.04} size={[band, 0.12, Math.max(0.1, room.depth - band * 2)]} mat="ceiling" castShadow={false} />
            <PlanBox x={room.x + room.width / 2} z={room.z + 0.8} y={WALL_HEIGHT - 0.18} size={[Math.max(0.2, room.width - 1.2), 0.045, 0.08]} mat="emissiveWarm" />
          </group>
        ))}
    </>
  );
}

function ApartmentShell({ showLabels }: { showLabels: boolean }) {
  const sortedRooms = useMemo(() => [...rooms].sort((a, b) => a.z - b.z), []);
  return (
    <group>
      <PlanBox x={apartmentBounds.centerX} z={apartmentBounds.centerZ} y={-0.16} size={[apartmentBounds.maxX - apartmentBounds.minX + 2, 0.06, apartmentBounds.maxZ - apartmentBounds.minZ + 2]} mat="warmTile" />
      {sortedRooms.map((room) => <FloorSlab key={room.id} room={room} showLabels={showLabels} />)}
      {wallSegments.map((segment) => <Wall key={segment.id} segment={segment} />)}
      {!showLabels ? windowSegments.map((segment) => <DaylightPanel key={`${segment.id}-daylight`} segment={segment} />) : null}
      {windowSegments.map((segment) => <GlassPanel key={segment.id} segment={segment} />)}
      {doorMarkers.map((door) => <DoorFrame key={door.id} door={door} showDebugSwing={showLabels} />)}
      <CeilingBands fullCeilings={!showLabels} />
    </group>
  );
}

function FlutedPanel({
  width,
  height = 6.2,
  strips = 12,
  mat = "walnut",
}: {
  width: number;
  height?: number;
  strips?: number;
  mat?: keyof typeof mats;
}) {
  return (
    <group>
      <LocalBox position={[0, 0.2, -0.035]} size={[width, height, 0.08]} mat="oak" />
      {Array.from({ length: strips }).map((_, index) => (
        <LocalBox
          key={`flute-${index}`}
          position={[-width / 2 + 0.12 + index * (width / strips), 0.25, 0.04]}
          size={[0.055, height - 0.1, 0.12]}
          mat={mat}
        />
      ))}
    </group>
  );
}

function MirrorPanel({ width = 1.2, height = 3.3 }) {
  return (
    <group>
      <LocalBox position={[0, 1.4, 0]} size={[width, height, 0.06]} mat="mirror" rounded radius={0.12} />
      <LocalBox position={[0, 1.35, 0.05]} size={[width + 0.08, height + 0.08, 0.04]} mat="champagne" rounded radius={0.13} />
    </group>
  );
}

function Plant({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <LocalCylinder position={[0, 0, 0]} radius={0.22} depth={0.42} mat="stone" />
      <LocalCylinder position={[0, 0.38, 0]} radius={0.035} depth={0.85} mat="greenery" segments={8} />
      {[-0.28, 0, 0.28].map((x, index) => (
        <mesh key={`leaf-${index}`} position={[x, 1.05 + index * 0.08, index % 2 ? -0.08 : 0.08]} rotation={[0.7, 0.2 + index, 0.4]} castShadow>
          <sphereGeometry args={[0.22, 16, 10]} />
          <meshStandardMaterial color={index === 1 ? "#526f42" : "#3f5d38"} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function BookStack({ colors = ["olive", "linen", "rust"] as (keyof typeof mats)[] }: { colors?: (keyof typeof mats)[] }) {
  return (
    <group>
      {colors.map((mat, index) => (
        <LocalBox key={`${mat}-${index}`} position={[0, 0.04 * index, 0.02 * index]} size={[0.72, 0.08, 0.42]} mat={mat} rounded radius={0.025} />
      ))}
    </group>
  );
}

function DecorTray() {
  return (
    <group>
      <LocalBox position={[0, 0, 0]} size={[0.75, 0.06, 0.42]} mat="black" rounded radius={0.05} />
      <LocalCylinder position={[-0.22, 0.06, 0.02]} radius={0.09} depth={0.08} mat="champagne" segments={18} />
      <LocalCylinder position={[0.18, 0.06, -0.03]} radius={0.12} depth={0.06} mat="stone" segments={22} />
    </group>
  );
}

function WallArt({
  width = 2.4,
  height = 1.5,
  mat = "taupe",
}: {
  width?: number;
  height?: number;
  mat?: keyof typeof mats;
}) {
  return (
    <group>
      <LocalBox position={[0, 0, -0.03]} size={[width + 0.16, height + 0.16, 0.06]} mat="champagne" rounded radius={0.035} />
      <LocalBox position={[0, 0, 0.02]} size={[width, height, 0.05]} mat={mat} rounded radius={0.03} />
      <LocalBox position={[-width * 0.22, height * 0.18, 0.06]} size={[width * 0.35, 0.08, 0.04]} mat="ivory" rounded radius={0.02} />
      <LocalBox position={[width * 0.2, -height * 0.1, 0.06]} size={[width * 0.28, 0.08, 0.04]} mat="rust" rounded radius={0.02} />
    </group>
  );
}

function TowelRolls() {
  return (
    <group>
      {[0, 0.22, 0.44].map((x) => (
        <mesh key={x} position={[x - 0.22, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.36, 24]} />
          <Material name="linen" />
        </mesh>
      ))}
    </group>
  );
}

function FoyerDesign() {
  return (
    <PlanGroup x={31.08} z={4.6} rotation={-Math.PI / 2}>
      <FlutedPanel width={4.6} height={6.6} strips={16} />
      <GlowStrip position={[0, 6.9, 0.12]} size={[4.4, 0.06, 0.05]} />
      <LocalBox position={[0, 0, 0.34]} size={[3.9, 0.8, 0.48]} mat="walnut" rounded radius={0.06} />
      <LocalBox position={[-1.35, 0.85, 0.38]} size={[1.25, 0.08, 0.36]} mat="stone" rounded radius={0.04} />
      <LocalCylinder position={[1.25, 0.82, 0.42]} radius={0.16} depth={0.08} mat="champagne" />
      <group position={[0.95, 1.15, 0.35]}>
        <MirrorPanel width={1.25} height={3.2} />
      </group>
    </PlanGroup>
  );
}

function DiningChair() {
  return (
    <group>
      <LocalBox position={[0, 0.05, 0.03]} size={[0.82, 0.22, 0.78]} mat="linen" rounded radius={0.12} />
      <LocalBox position={[0, 0.58, -0.31]} size={[0.84, 1.02, 0.16]} mat="taupe" rounded radius={0.14} />
      <LocalBox position={[0, 0.57, -0.2]} size={[0.66, 0.72, 0.08]} mat="linen" rounded radius={0.1} />
      {[-0.3, 0.3].map((x) => [-0.25, 0.25].map((z) => <LocalBox key={`${x}-${z}`} position={[x, -0.46, z]} size={[0.055, 0.62, 0.055]} mat="black" />))}
      <LocalBox position={[0, -0.18, 0.22]} size={[0.72, 0.055, 0.055]} mat="black" />
    </group>
  );
}

function Pendant({ x, z, y = 6.2, scale = 1 }: { x: number; z: number; y?: number; scale?: number }) {
  return (
    <PlanGroup x={x} z={z}>
      <LocalCylinder position={[0, y, 0]} radius={0.03 * scale} depth={1.2 * scale} mat="black" segments={12} />
      <mesh position={[0, y - 0.72 * scale, 0]} castShadow>
        <sphereGeometry args={[0.28 * scale, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b88d4f" roughness={0.38} metalness={0.42} emissive="#875828" emissiveIntensity={0.06} />
      </mesh>
      <pointLight position={[0, y - 0.8 * scale, 0]} intensity={0.18} distance={6.5} color="#ffdca6" />
    </PlanGroup>
  );
}

function DiningDesign() {
  return (
    <group>
      <PlanGroup x={23.5} z={14.1}>
        <LocalBox position={[0, 0, 0]} size={[5.35, 0.22, 2.2]} mat="marble" rounded radius={0.1} />
        <LocalBox position={[0, -0.82, 0]} size={[0.42, 0.9, 1.35]} mat="walnut" rounded radius={0.06} />
        {[-2, 0, 2].map((x) => (
          <group key={`chair-back-${x}`} position={[x, 0, -1.62]} rotation={[0, Math.PI, 0]}>
            <DiningChair />
          </group>
        ))}
        {[-2, 0, 2].map((x) => (
          <group key={`chair-front-${x}`} position={[x, 0, 1.62]}>
            <DiningChair />
          </group>
        ))}
        <LocalCylinder position={[-0.45, 0.22, 0]} radius={0.16} depth={0.2} mat="black" />
        <LocalCylinder position={[0.05, 0.22, 0.12]} radius={0.12} depth={0.28} mat="champagne" />
        <LocalCylinder position={[0.48, 0.22, -0.1]} radius={0.18} depth={0.16} mat="stone" />
      </PlanGroup>
      <Pendant x={23.5} z={14.1} y={6.6} scale={1.25} />
      <PlanGroup x={18.2} z={14.3} rotation={Math.PI / 2}>
        <FlutedPanel width={4.9} height={5.5} strips={14} mat="oak" />
        <LocalBox position={[0, 0, 0.34]} size={[3.8, 0.85, 0.42]} mat="walnut" rounded radius={0.05} />
        <LocalBox position={[0, 2.2, 0.37]} size={[2.6, 1.55, 0.05]} mat="mirror" rounded radius={0.04} />
      </PlanGroup>
    </group>
  );
}

function Sofa() {
  return (
    <group>
      <LocalBox position={[0, -0.06, 0.12]} size={[6.15, 0.18, 1.35]} mat="walnut" rounded radius={0.08} />
      {[-1.95, 0, 1.95].map((x) => (
        <LocalBox key={`seat-${x}`} position={[x, 0.08, 0.15]} size={[1.85, 0.42, 1.18]} mat="linen" rounded radius={0.18} />
      ))}
      <LocalBox position={[0, 0.52, -0.52]} size={[6.25, 1.1, 0.26]} mat="fabric" rounded radius={0.16} />
      <LocalBox position={[-2.88, 0.26, 0.1]} size={[0.36, 0.78, 1.22]} mat="fabric" rounded radius={0.14} />
      <LocalBox position={[2.88, 0.26, 0.1]} size={[0.36, 0.78, 1.22]} mat="fabric" rounded radius={0.14} />
      <LocalBox position={[-1.58, 0.72, -0.19]} size={[0.92, 0.34, 0.2]} mat="olive" rounded radius={0.09} />
      <LocalBox position={[0.0, 0.72, -0.19]} size={[0.86, 0.32, 0.2]} mat="rust" rounded radius={0.09} />
      <LocalBox position={[1.46, 0.72, -0.19]} size={[0.86, 0.32, 0.2]} mat="taupe" rounded radius={0.09} />
      {[-2.45, 2.45].map((x) => [-0.48, 0.58].map((z) => <LocalBox key={`sofa-leg-${x}-${z}`} position={[x, -0.42, z]} size={[0.08, 0.42, 0.08]} mat="black" />))}
    </group>
  );
}

function LoungeChair() {
  return (
    <group>
      <LocalBox position={[0, 0, 0]} size={[1.1, 0.5, 0.95]} mat="olive" rounded radius={0.14} />
      <LocalBox position={[0, 0.42, -0.42]} size={[1.1, 1, 0.18]} mat="olive" rounded radius={0.12} />
      <LocalBox position={[-0.42, -0.25, 0.25]} size={[0.08, 0.45, 0.08]} mat="black" />
      <LocalBox position={[0.42, -0.25, 0.25]} size={[0.08, 0.45, 0.08]} mat="black" />
    </group>
  );
}

function LivingDesign() {
  return (
    <group>
      <PlanGroup x={30} z={29.1} rotation={Math.PI}>
        <Sofa />
      </PlanGroup>
      <PlanBox x={29.6} z={28.1} y={0.02} size={[6.7, 0.035, 4.2]} mat="linen" rounded radius={0.08} />
      <PlanGroup x={34.75} z={29.1} rotation={-Math.PI / 2}>
        <LocalBox position={[0, 0.25, 0]} size={[6.2, 3.1, 0.22]} mat="stone" />
        <LocalBox position={[0, 1.15, 0.13]} size={[2.9, 1.65, 0.08]} mat="black" rounded radius={0.04} />
        <LocalBox position={[0, 0, 0.22]} size={[4.2, 0.45, 0.36]} mat="walnut" rounded radius={0.05} />
        <GlowStrip position={[0, 3.45, 0.22]} size={[5.3, 0.08, 0.06]} />
        <FlutedPanel width={2.1} height={3.1} strips={9} mat="walnut" />
      </PlanGroup>
      <Curtains x={28.8} z={38.18} width={8.4} rotation={0} />
    </group>
  );
}

function Curtains({ x, z, width, rotation = 0 }: { x: number; z: number; width: number; rotation?: number }) {
  return (
    <PlanGroup x={x} z={z} rotation={rotation}>
      <LocalBox position={[0, 0.25, 0.16]} size={[width, 5.9, 0.05]} mat="linen" />
      <LocalBox position={[-width / 2 + 0.32, 0.2, 0.22]} size={[0.5, 6.1, 0.12]} mat="taupe" />
      <LocalBox position={[width / 2 - 0.32, 0.2, 0.22]} size={[0.5, 6.1, 0.12]} mat="taupe" />
      <LocalBox position={[0, 6.15, 0.26]} size={[width, 0.08, 0.12]} mat="black" />
    </PlanGroup>
  );
}

function BalconyChair() {
  return (
    <group>
      <LocalBox position={[0, 0, 0]} size={[0.9, 0.35, 0.85]} mat="charcoal" rounded radius={0.1} />
      <LocalBox position={[0, 0.32, -0.36]} size={[0.9, 0.75, 0.12]} mat="charcoal" rounded radius={0.08} />
      <LocalBox position={[0, 0.36, 0.02]} size={[0.7, 0.18, 0.55]} mat="linen" rounded radius={0.08} />
    </group>
  );
}

function LivingBalconyDesign() {
  return (
    <group>
      <PlanGroup x={27.2} z={41.3} rotation={0.2}>
        <BalconyChair />
      </PlanGroup>
      <PlanGroup x={31.6} z={41.3} rotation={-0.2}>
        <BalconyChair />
      </PlanGroup>
      <PlanGroup x={29.4} z={41.5}>
        <LocalCylinder position={[0, 0, 0]} radius={0.48} depth={0.38} mat="walnut" />
        <LocalCylinder position={[0, 0.36, 0]} radius={0.58} depth={0.08} mat="stone" />
        <LocalCylinder position={[0.13, 0.48, -0.08]} radius={0.1} depth={0.12} mat="champagne" />
      </PlanGroup>
      {[25.2, 28.7, 33.5].map((x) => (
        <PlanGroup key={`bal-plant-${x}`} x={x} z={43.1}>
          <Plant scale={0.8} />
        </PlanGroup>
      ))}
      <PlanBox x={24.45} z={41.4} y={1.5} size={[0.08, 2.2, 3.5]} mat="greenery" />
      <PlanBox x={24.52} z={41.4} y={3.6} size={[0.1, 0.08, 3.6]} mat="emissiveWarm" />
    </group>
  );
}

function KitchenDesign() {
  return (
    <group>
      <PlanGroup x={23.2} z={0.55}>
        <LocalBox position={[0, 0, 0]} size={[8.8, 0.9, 0.72]} mat="charcoal" rounded radius={0.04} />
        <LocalBox position={[0, 0.9, 0]} size={[8.9, 0.16, 0.82]} mat="marble" />
        <LocalBox position={[0, 1.18, 0.08]} size={[8.8, 1.1, 0.12]} mat="stone" />
        <LocalBox position={[-2.6, 2.45, 0]} size={[2.1, 1.4, 0.52]} mat="ivory" rounded radius={0.04} />
        <LocalBox position={[0.2, 2.45, 0]} size={[2.1, 1.4, 0.52]} mat="ivory" rounded radius={0.04} />
        <LocalBox position={[2.7, 2.45, 0]} size={[1.8, 1.4, 0.52]} mat="ivory" rounded radius={0.04} />
        <LocalBox position={[1.8, 1.14, 0.1]} size={[1.05, 0.08, 0.5]} mat="black" />
        <LocalBox position={[1.8, 2.1, 0.12]} size={[1.3, 0.22, 0.42]} mat="black" />
      </PlanGroup>
      <PlanGroup x={18.45} z={4.5} rotation={Math.PI / 2}>
        <LocalBox position={[0, 0, 0]} size={[6.6, 0.9, 0.72]} mat="walnut" rounded radius={0.04} />
        <LocalBox position={[0, 0.9, 0]} size={[6.7, 0.16, 0.82]} mat="marble" />
        <LocalBox position={[-2.3, 1.08, 0.1]} size={[0.8, 0.38, 0.46]} mat="mirror" rounded radius={0.04} />
        <LocalBox position={[2, 0.98, 0.1]} size={[0.9, 1.55, 0.54]} mat="ivory" rounded radius={0.04} />
      </PlanGroup>
      <PlanGroup x={20.35} z={0.88} y={1.12}>
        <LocalCylinder position={[0, 0, 0]} radius={0.13} depth={0.2} mat="linen" segments={22} />
        <LocalCylinder position={[0.72, 0, -0.05]} radius={0.16} depth={0.32} mat="stone" segments={24} />
        <LocalBox position={[1.28, 0, 0]} size={[0.55, 0.08, 0.32]} mat="oak" rounded radius={0.03} />
      </PlanGroup>
      <PlanGroup x={18.7} z={5.15} y={1.12} rotation={Math.PI / 2}>
        <LocalCylinder position={[0, 0, 0]} radius={0.12} depth={0.18} mat="linen" segments={22} />
        <LocalBox position={[0.58, 0, -0.03]} size={[0.45, 0.08, 0.32]} mat="black" rounded radius={0.025} />
      </PlanGroup>
      <Pendant x={23.1} z={8.9} y={6.2} scale={0.7} />
    </group>
  );
}

function UtilityDesign() {
  return (
    <PlanGroup x={15.3} z={4.1}>
      <LocalBox position={[0, 0, -1.25]} size={[3.2, 0.9, 0.58]} mat="stone" />
      <LocalBox position={[-0.95, 0.12, -1.05]} size={[0.82, 0.72, 0.16]} mat="mirror" rounded radius={0.04} />
      <LocalBox position={[0.7, 0.95, -1.2]} size={[1.2, 1.1, 0.42]} mat="ivory" />
      <LocalCylinder position={[1.55, 2.8, -0.95]} radius={0.03} depth={2.3} mat="black" segments={10} />
      <LocalBox position={[-1.6, 0, 0.9]} size={[0.5, 2.6, 0.45]} mat="walnut" />
    </PlanGroup>
  );
}

function Bed({ king = false, accent = "taupe" as keyof typeof mats }: { king?: boolean; accent?: keyof typeof mats }) {
  const width = king ? 6.6 : 5.4;
  const depth = king ? 6.9 : 6.4;
  return (
    <group>
      <LocalBox position={[0, 0, 0]} size={[width, 0.55, depth]} mat="linen" rounded radius={0.12} />
      <LocalBox position={[0, 0.55, -depth / 2 + 0.22]} size={[width, 1.35, 0.32]} mat={accent} rounded radius={0.12} />
      <LocalBox position={[-width * 0.22, 0.64, 1.15]} size={[1.55, 0.32, 0.5]} mat="ivory" rounded radius={0.08} />
      <LocalBox position={[width * 0.22, 0.64, 1.15]} size={[1.55, 0.32, 0.5]} mat="ivory" rounded radius={0.08} />
      <LocalBox position={[-width * 0.1, 0.83, 0.35]} size={[1.4, 0.2, 0.38]} mat="rust" rounded radius={0.08} />
      <LocalBox position={[width * 0.16, 0.84, 0.48]} size={[1.3, 0.18, 0.36]} mat="olive" rounded radius={0.08} />
    </group>
  );
}

function Wardrobe({ width = 4.8, height = 6.3 }: { width?: number; height?: number }) {
  return (
    <group>
      <LocalBox position={[0, 0, 0]} size={[width, height, 0.55]} mat="oak" />
      {[-0.25, 0.25].map((x, i) => <LocalBox key={i} position={[x * width, 0.1, 0.32]} size={[0.04, height - 0.4, 0.08]} mat="champagne" />)}
      <GlowStrip position={[0, height + 0.1, 0.32]} size={[width - 0.3, 0.05, 0.05]} />
    </group>
  );
}

function BedroomOneDesign() {
  return (
    <group>
      <PlanGroup x={42.2} z={33.4} rotation={0}>
        <Bed accent="olive" />
      </PlanGroup>
      <PlanBox x={42.2} z={34.9} y={0.025} size={[6.8, 0.035, 4.4]} mat="linen" rounded radius={0.08} />
      <PlanGroup x={46.1} z={31.8} rotation={-Math.PI / 2}>
        <FlutedPanel width={5.8} height={4.4} strips={12} mat="oak" />
      </PlanGroup>
      <PlanGroup x={36.4} z={21.2} rotation={Math.PI / 2}>
        <Wardrobe width={5.6} height={6.1} />
      </PlanGroup>
      <Curtains x={41.1} z={38.16} width={6.2} />
      <Pendant x={39.2} z={32.1} y={5.9} scale={0.55} />
      <Pendant x={45.1} z={32.1} y={5.9} scale={0.55} />
    </group>
  );
}

function BedroomTwoDesign() {
  return (
    <group>
      <PlanGroup x={17.9} z={34.1} rotation={0}>
        <Bed accent="taupe" />
      </PlanGroup>
      <PlanBox x={18} z={35.3} y={0.025} size={[6, 0.035, 4]} mat="linen" rounded radius={0.08} />
      <PlanGroup x={13.4} z={31.2} rotation={Math.PI / 2}>
        <Wardrobe width={4.7} height={6} />
      </PlanGroup>
      <PlanGroup x={21.9} z={30.4} rotation={-Math.PI / 2}>
        <LocalBox position={[0, 0, 0]} size={[3, 0.72, 0.55]} mat="walnut" rounded radius={0.05} />
        <LocalBox position={[0, 0.74, -0.18]} size={[2.7, 0.08, 0.26]} mat="stone" />
        <LocalBox position={[-0.85, 1.22, -0.18]} size={[0.9, 0.08, 0.22]} mat="oak" />
        <LocalBox position={[0.7, 1.55, -0.18]} size={[1.1, 0.08, 0.22]} mat="oak" />
      </PlanGroup>
      <Curtains x={18} z={37.54} width={5.8} />
      <Pendant x={15.3} z={32.6} y={5.9} scale={0.52} />
    </group>
  );
}

function MasterBedroomDesign() {
  return (
    <group>
      <PlanGroup x={5.4} z={29.4} rotation={0}>
        <Bed king accent="taupe" />
      </PlanGroup>
      <PlanBox x={5.4} z={30.8} y={0.025} size={[7.5, 0.04, 4.7]} mat="linen" rounded radius={0.08} />
      <PlanGroup x={0.35} z={26.9} rotation={Math.PI / 2}>
        <FlutedPanel width={8.4} height={5.1} strips={18} mat="walnut" />
      </PlanGroup>
      <PlanGroup x={10.55} z={26.8} rotation={-Math.PI / 2}>
        <Wardrobe width={8.5} height={6.4} />
      </PlanGroup>
      <PlanGroup x={2.5} z={32.2} rotation={0.7}>
        <LoungeChair />
      </PlanGroup>
      <Curtains x={5.5} z={33.18} width={8.2} />
      <Pendant x={2.4} z={27.9} y={6.1} scale={0.6} />
      <Pendant x={8.4} z={27.9} y={6.1} scale={0.6} />
    </group>
  );
}

function Bathroom({
  x,
  z,
  rotation = 0,
  compact = false,
}: {
  x: number;
  z: number;
  rotation?: number;
  compact?: boolean;
}) {
  return (
    <PlanGroup x={x} z={z} rotation={rotation}>
      <LocalBox position={[0, 0, -1.7]} size={[compact ? 2.2 : 2.8, 0.7, 0.5]} mat="walnut" rounded radius={0.04} />
      <LocalBox position={[0, 0.74, -1.72]} size={[compact ? 2.3 : 2.9, 0.12, 0.58]} mat="marble" />
      <LocalCylinder position={[0, 0.9, -1.72]} radius={0.22} depth={0.14} mat="mirror" />
      <LocalBox position={[0, 1.35, -1.98]} size={[1.45, 1.55, 0.05]} mat="mirror" rounded radius={0.05} />
      <GlowStrip position={[0, 3.05, -1.95]} size={[1.55, 0.06, 0.05]} />
      <LocalBox position={[1.55, 0, 0.45]} size={[0.12, 5.5, 2.1]} mat="mirror" />
      <LocalBox position={[1.05, 0, 1.25]} size={[0.9, 0.2, 0.9]} mat="wetTile" rounded radius={0.08} />
      <LocalCylinder position={[1.05, 0.22, 1.25]} radius={0.2} depth={0.35} mat="ivory" segments={28} />
      <LocalCylinder position={[-1.05, 0, 0.95]} radius={0.36} depth={0.42} mat="ivory" segments={28} />
      <LocalBox position={[-1.05, 0.42, 0.78]} size={[0.7, 0.55, 0.16]} mat="ivory" rounded radius={0.05} />
      <LocalBox position={[1.5, 2.8, 1.5]} size={[0.08, 0.5, 0.08]} mat="black" />
      <LocalBox position={[1.22, 2.72, 1.5]} size={[0.56, 0.08, 0.08]} mat="black" />
    </PlanGroup>
  );
}

function BathroomDesigns() {
  return (
    <group>
      <Bathroom x={43.85} z={20.8} rotation={0} compact />
      <Bathroom x={12.9} z={11.5} rotation={Math.PI} />
      <Bathroom x={4.4} z={17.3} rotation={Math.PI} compact />
    </group>
  );
}

function MasterBalconyDesign() {
  return (
    <group>
      <PlanGroup x={3.3} z={36.2} rotation={0.15}>
        <BalconyChair />
      </PlanGroup>
      <PlanGroup x={6.9} z={36.2} rotation={-0.15}>
        <LocalBox position={[0, 0, 0]} size={[2.2, 0.38, 0.82]} mat="charcoal" rounded radius={0.12} />
        <LocalBox position={[0, 0.34, -0.32]} size={[2.2, 0.72, 0.14]} mat="charcoal" rounded radius={0.1} />
        <LocalBox position={[0, 0.4, 0.04]} size={[1.8, 0.2, 0.5]} mat="linen" rounded radius={0.08} />
      </PlanGroup>
      <PlanGroup x={5.25} z={36.45}>
        <LocalCylinder position={[0, 0, 0]} radius={0.36} depth={0.34} mat="walnut" />
        <LocalCylinder position={[0, 0.32, 0]} radius={0.48} depth={0.08} mat="stone" />
      </PlanGroup>
      {[1.1, 5.2, 9.6].map((x) => (
        <PlanGroup key={`master-bal-plant-${x}`} x={x} z={37.6}>
          <Plant scale={0.72} />
        </PlanGroup>
      ))}
      <PlanBox x={0.4} z={35.8} y={3.2} size={[0.08, 0.08, 3.2]} mat="emissiveWarm" />
    </group>
  );
}

function GlowPlane({
  x,
  z,
  width,
  depth,
  rotation = 0,
  opacity = 0.12,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  rotation?: number;
  opacity?: number;
}) {
  return (
    <PlanGroup x={x} z={z} y={0.045} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color="#ffd89b" transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </PlanGroup>
  );
}

function DaylightFloorPatches() {
  return (
    <group>
      <GlowPlane x={29.5} z={35.6} width={6.8} depth={3.2} opacity={0.14} />
      <GlowPlane x={5.5} z={31.8} width={6.4} depth={2.7} opacity={0.12} />
      <GlowPlane x={18.1} z={35.9} width={4.6} depth={2.2} opacity={0.08} />
      <GlowPlane x={42.0} z={36.1} width={5.0} depth={2.1} opacity={0.08} />
    </group>
  );
}

function AssetInteriorLayer() {
  return (
    <group>
      {/* Foyer: make the entry feel curated rather than empty. */}
      <PlanAsset asset="tableLamp" x={31.65} z={3.6} y={0.86} rotation={-Math.PI / 2} scale={2.15} />
      <PlanAsset asset="potPlant" x={34.5} z={7.5} scale={1.65} />

      {/* Dining / living: small accessories only; larger furniture is fitted from higher-quality models. */}
      <PlanAsset asset="lampStand" x={33.85} z={34.9} rotation={Math.PI * 0.9} scale={2.0} />
      <PlanGroup x={29.5} z={30.1} y={0.62}>
        <DecorTray />
      </PlanGroup>
      <PlanGroup x={28.7} z={30.55} y={0.62} rotation={0.25}>
        <BookStack />
      </PlanGroup>
      <PlanGroup x={34.65} z={27.2} y={3.1} rotation={-Math.PI / 2}>
        <WallArt width={2.6} height={1.5} mat="olive" />
      </PlanGroup>

      {/* Bedroom 1. */}
      <PlanAsset asset="tableLamp" x={38.7} z={31.4} y={0.55} rotation={0.25} scale={1.45} />
      <PlanAsset asset="tableLamp" x={45.0} z={31.4} y={0.55} rotation={-0.25} scale={1.45} />
      <PlanAsset asset="potPlant" x={45.6} z={36.7} scale={1.45} />
      <PlanGroup x={46.2} z={31.4} y={3.5} rotation={-Math.PI / 2}>
        <WallArt width={2.1} height={1.3} mat="olive" />
      </PlanGroup>

      {/* Bedroom 2 / work room. */}
      <PlanAsset asset="coffeeMug" x={21.5} z={29.55} y={0.82} rotation={0.1} scale={1.75} />
      <PlanAsset asset="potPlant" x={14.0} z={36.6} scale={1.35} />
      <PlanGroup x={13.25} z={31.1} y={3.2} rotation={Math.PI / 2}>
        <WallArt width={1.8} height={1.2} mat="taupe" />
      </PlanGroup>

      {/* Bathrooms: small but visible hotel-like accessories. */}
      <PlanGroup x={12.4} z={11.4} y={0.94} rotation={Math.PI}>
        <TowelRolls />
      </PlanGroup>
      <PlanAsset asset="jar" x={13.9} z={10.15} y={0.85} scale={0.92} />
      <PlanGroup x={43.4} z={19.3} y={0.86}>
        <TowelRolls />
      </PlanGroup>
      <PlanAsset asset="jar" x={44.8} z={19.2} y={0.82} scale={0.85} />
      <PlanGroup x={4.05} z={16.6} y={0.86} rotation={Math.PI}>
        <TowelRolls />
      </PlanGroup>

      {/* Master suite and private balcony. */}
      <PlanAsset asset="tableLamp" x={2.0} z={27.3} y={0.6} rotation={0.1} scale={1.55} />
      <PlanAsset asset="tableLamp" x={8.7} z={27.3} y={0.6} rotation={-0.1} scale={1.55} />
      <PlanGroup x={0.45} z={27.4} y={4.1} rotation={Math.PI / 2}>
        <WallArt width={3.2} height={1.6} mat="taupe" />
      </PlanGroup>
      <PlanAsset asset="coffeeMug" x={8.72} z={36.18} y={0.72} scale={1.7} />
    </group>
  );
}

function PremiumModelLayer() {
  const nightstandFit: Vec3 = [0.85, 0.9, 0.72];
  return (
    <group>
      {/* Dining */}
      <PlanFittedAsset asset="cabinet" x={18.35} z={15.6} rotation={Math.PI / 2} fit={[3.5, 1.3, 0.78]} />

      {/* Living */}
      <PlanFittedAsset asset="coffeeTable" x={29.5} z={30.05} rotation={0} fit={[2.55, 0.85, 1.28]} />
      <PlanFittedAsset asset="modernArmChair" x={26.1} z={35.2} rotation={-0.55} fit={[1.65, 2.15, 1.65]} />
      <PlanFittedAsset asset="tallSideTable" x={26.55} z={33.75} rotation={0.18} fit={[0.78, 1.15, 0.78]} />
      <PlanFittedAsset asset="pottedPlant4" x={25.15} z={36.25} rotation={0.25} fit={[1.25, 2.25, 1.25]} />
      <PlanFittedAsset asset="pachira" x={33.35} z={36.15} rotation={-0.3} fit={[1.3, 2.3, 1.3]} />

      {/* Balconies */}
      <PlanFittedAsset asset="pottedPlant1" x={25.4} z={42.7} rotation={0.2} fit={[1.05, 1.85, 1.05]} />
      <PlanFittedAsset asset="pottedPlant2" x={33.35} z={42.45} rotation={-0.2} fit={[1.05, 1.95, 1.05]} />

      {/* Bedroom 1 */}
      <PlanFittedAsset asset="nightstand" x={38.65} z={31.25} rotation={0} fit={nightstandFit} />
      <PlanFittedAsset asset="nightstand" x={45.05} z={31.25} rotation={0} fit={nightstandFit} />
      <PlanFittedAsset asset="sideTable" x={45.35} z={36.2} rotation={-0.3} fit={[0.78, 0.9, 0.72]} />
      <PlanFittedAsset asset="pottedPlant2" x={45.8} z={36.85} rotation={0.1} fit={[1.0, 1.8, 1.0]} />

      {/* Bedroom 2 */}
      <PlanFittedAsset asset="nightstand" x={15.1} z={31.5} rotation={0} fit={[0.78, 0.82, 0.68]} />
      <PlanFittedAsset asset="shelves" x={21.9} z={31.85} rotation={-Math.PI / 2} fit={[2.35, 2.1, 0.62]} />
      <PlanFittedAsset asset="sideTable" x={21.9} z={29.6} rotation={-Math.PI / 2} fit={[0.9, 0.88, 0.74]} />
      <PlanFittedAsset asset="pottedPlant1" x={14.05} z={36.7} rotation={0.1} fit={[0.95, 1.65, 0.95]} />

      {/* Master suite */}
      <PlanFittedAsset asset="nightstand" x={1.9} z={27.25} rotation={0} fit={[0.92, 0.95, 0.78]} />
      <PlanFittedAsset asset="nightstand" x={8.9} z={27.25} rotation={0} fit={[0.92, 0.95, 0.78]} />
      <PlanFittedAsset asset="modernArmChair" x={2.45} z={32.2} rotation={0.7} fit={[1.55, 2.05, 1.55]} />
      <PlanFittedAsset asset="pottedPlant4" x={9.55} z={32.5} rotation={-0.15} fit={[1.2, 2.25, 1.2]} />
      <PlanFittedAsset asset="pottedPlant2" x={1.2} z={37.55} rotation={0.15} fit={[0.9, 1.65, 0.9]} />
      <PlanFittedAsset asset="pottedPlant1" x={9.6} z={37.55} rotation={-0.15} fit={[0.9, 1.65, 0.9]} />
    </group>
  );
}

function InteriorDesign() {
  return (
    <group>
      <FoyerDesign />
      <DiningDesign />
      <LivingDesign />
      <LivingBalconyDesign />
      <KitchenDesign />
      <UtilityDesign />
      <BedroomOneDesign />
      <BedroomTwoDesign />
      <BathroomDesigns />
      <MasterBedroomDesign />
      <MasterBalconyDesign />
      <Suspense fallback={null}>
        <PremiumModelLayer />
        <AssetInteriorLayer />
      </Suspense>
    </group>
  );
}

function InteriorLights() {
  return (
    <>
      <pointLight position={[33, 7.1, planZToWorld(4.5)]} intensity={0.44} distance={10} color="#ffd6a0" />
      <pointLight position={[23.5, 7.2, planZToWorld(14.1)]} intensity={0.5} distance={12} color="#ffd7a3" />
      <pointLight position={[29.5, 7.2, planZToWorld(28.5)]} intensity={0.52} distance={14} color="#ffddb0" />
      <pointLight position={[22.5, 6.8, planZToWorld(4.5)]} intensity={0.4} distance={10} color="#ffe1b2" />
      <pointLight position={[42, 6.8, planZToWorld(32)]} intensity={0.42} distance={10} color="#ffe0b0" />
      <pointLight position={[18, 6.8, planZToWorld(33)]} intensity={0.36} distance={10} color="#ffe2b8" />
      <pointLight position={[5.5, 6.8, planZToWorld(29)]} intensity={0.48} distance={12} color="#ffe0b0" />
      <rectAreaLight position={[29.5, 5.2, planZToWorld(39)]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={4} intensity={0.42} color="#fff4e8" />
      <rectAreaLight position={[5.6, 5.2, planZToWorld(34)]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={4} intensity={0.36} color="#fff0dc" />
      <rectAreaLight position={[29.5, 4.3, planZToWorld(41.8)]} rotation={[-Math.PI / 2, 0, 0]} width={9} height={5} intensity={0.34} color="#ffd7a3" />
    </>
  );
}

function ExteriorBuilding({
  x,
  z,
  width,
  depth,
  height,
  color,
  windowTint = "#d8e4ef",
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  windowTint?: string;
}) {
  const columns = Math.max(2, Math.floor(width / 1.2));
  const rows = Math.max(3, Math.floor(height / 2.1));
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.72} metalness={0.03} transparent opacity={0.46} />
      </mesh>
      {Array.from({ length: columns }).map((_, col) =>
        Array.from({ length: rows }).map((__, row) => (
          <mesh
            key={`${col}-${row}`}
            position={[-width / 2 + 0.55 + col * (width / columns), 1.2 + row * (height / (rows + 1)), depth / 2 + 0.025]}
          >
            <boxGeometry args={[0.38, 0.42, 0.035]} />
            <meshStandardMaterial color={windowTint} transparent opacity={0.35} emissive={row % 5 === 0 ? "#d6b477" : "#263341"} emissiveIntensity={row % 5 === 0 ? 0.025 : 0.0} roughness={0.28} metalness={0.22} />
          </mesh>
        )),
      )}
    </group>
  );
}

function ExteriorBackdrop() {
  const texture = useTexture(cityBackdropUrl);
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);
  return (
    <mesh position={[24, 15, -44]}>
      <planeGeometry args={[88, 36]} />
      <meshBasicMaterial map={texture} transparent opacity={0.74} depthWrite={false} />
    </mesh>
  );
}

function ExteriorContext() {
  const buildings = [
    { x: -12, z: -16, width: 7.5, depth: 8, height: 22, color: "#7b858a" },
    { x: -2, z: -22, width: 10, depth: 9, height: 32, color: "#59656c" },
    { x: 10, z: -18, width: 7, depth: 7, height: 18, color: "#8a8f8a" },
    { x: 22, z: -26, width: 11, depth: 9, height: 36, color: "#4f5c64" },
    { x: 36, z: -19, width: 8, depth: 8, height: 25, color: "#737d82" },
    { x: 49, z: -24, width: 9, depth: 8, height: 30, color: "#5d6a71" },
  ];
  return (
    <group>
      <ExteriorBackdrop />
      <mesh position={[24, -0.14, -22]} receiveShadow>
        <boxGeometry args={[76, 0.06, 44]} />
        <meshStandardMaterial color="#8a9290" roughness={0.84} metalness={0.02} transparent opacity={0.52} />
      </mesh>
      {buildings.map((building) => (
        <ExteriorBuilding key={`${building.x}-${building.z}`} {...building} />
      ))}
      <mesh position={[24, 7, -10]} rotation={[0, 0, 0]}>
        <boxGeometry args={[76, 14, 0.06]} />
        <meshBasicMaterial color="#e5d5bd" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.13} />
      <hemisphereLight args={["#ffe4c4", "#5d5147", 0.38]} />
      <directionalLight
        position={[16, 32, planZToWorld(49)]}
        intensity={1.34}
        color="#fff1d4"
        castShadow
        shadow-mapSize={[3072, 3072]}
        shadow-camera-left={-28}
        shadow-camera-right={42}
        shadow-camera-top={36}
        shadow-camera-bottom={-26}
      />
      <directionalLight position={[-18, 20, planZToWorld(-8)]} intensity={0.08} color="#d6e6ff" />
      <InteriorLights />
      <Environment files={hdriUrl} background backgroundBlurriness={0.42} environmentIntensity={0.38} backgroundIntensity={0.72} />
    </>
  );
}

function SceneContents({ showTopLabels }: { showTopLabels: boolean }) {
  return (
    <>
      <RendererSettings />
      <color attach="background" args={["#bba78d"]} />
      <fog attach="fog" args={["#bba78d", 78, 138]} />
      <SoftShadows size={20} samples={12} focus={0.65} />
      <Lighting />
      {!showTopLabels ? <ExteriorContext /> : null}
      <ApartmentShell showLabels={showTopLabels} />
      <InteriorDesign />
      <ContactShadows position={[apartmentBounds.centerX, 0.02, planZToWorld(apartmentBounds.centerZ)]} opacity={0.58} scale={62} blur={2.0} far={42} />
      {!showTopLabels ? (
        <EffectComposer multisampling={2} enableNormalPass>
          <SSAO
            samples={16}
            radius={0.22}
            intensity={16}
            luminanceInfluence={0.62}
            worldDistanceThreshold={0.28}
            worldDistanceFalloff={0.08}
            worldProximityThreshold={0.22}
            worldProximityFalloff={0.08}
          />
          <Bloom intensity={0} luminanceThreshold={1} luminanceSmoothing={0.1} />
          <DepthOfField focusDistance={0.026} focalLength={0.008} bokehScale={0.012} />
          <Noise opacity={0.018} />
          <Vignette offset={0.22} darkness={0.36} />
        </EffectComposer>
      ) : null}
    </>
  );
}

function RendererSettings() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.92;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);
  return null;
}

function DebugScene({ view }: { view: CheckpointView }) {
  return (
    <>
      <StaticCamera view={view} />
      <SceneContents showTopLabels={view.type === "top"} />
    </>
  );
}

function WalkthroughScene({ timeMs }: { timeMs: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[33.1, CAMERA_HEIGHT, planZToWorld(-1)]} fov={64} near={0.12} far={220} />
      <WalkthroughCamera timeMs={timeMs} />
      <SceneContents showTopLabels={false} />
      <SceneReadySignal />
    </>
  );
}

function RoomLabel({ timeMs }: { timeMs: number }) {
  const { label, opacity } = currentRoomLabel(timeMs / 1000);
  return (
    <div className="room-label" style={{ opacity }}>
      {label}
    </div>
  );
}

function CutFade({ timeMs }: { timeMs: number }) {
  const timeSeconds = timeMs / 1000;
  const opacity = cutTimes.reduce((highest, cutTime) => {
    const local = Math.max(0, 1 - Math.abs(timeSeconds - cutTime) / 0.34);
    return Math.max(highest, local * 0.82);
  }, 0);
  return <div className="cut-fade" style={{ opacity }} />;
}

function CaptureWalkthroughCanvas({ initialTimeMs }: { initialTimeMs: number }) {
  const [timeMs, setTimeMs] = useState(initialTimeMs);

  useEffect(() => {
    window.__setApartmentCaptureTime = (nextTimeMs: number) => {
      window.__APARTMENT_SCENE_READY = false;
      flushSync(() => setTimeMs(nextTimeMs));
    };
    return () => {
      window.__setApartmentCaptureTime = undefined;
    };
  }, []);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true,
        }}
      >
        <WalkthroughScene timeMs={timeMs} />
      </Canvas>
      <CutFade timeMs={timeMs} />
      <RoomLabel timeMs={timeMs} />
    </>
  );
}

function AutoWalkthroughCanvas() {
  const [timeMs, setTimeMs] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setTimeMs((now - startedAt) % (WALKTHROUGH_DURATION_SECONDS * 1000));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true,
        }}
      >
        <WalkthroughScene timeMs={timeMs} />
      </Canvas>
      <CutFade timeMs={timeMs} />
      <RoomLabel timeMs={timeMs} />
    </>
  );
}

export function ApartmentScene({ mode = "debug", timeMs }: { mode?: SceneMode; timeMs?: number }) {
  const view = getDebugView();
  const standaloneWalkthroughTime = getStandaloneWalkthroughTime();
  const isCaptureMode = getIsCaptureMode();
  const fixedWalkthroughTime = typeof timeMs === "number" ? timeMs : standaloneWalkthroughTime;
  const isWalkthrough = mode === "walkthrough" || fixedWalkthroughTime !== null;
  return (
    <div className="checkpoint-shell final-shell">
      {mode === "walkthrough" && fixedWalkthroughTime === null && !isCaptureMode ? (
        <AutoWalkthroughCanvas />
      ) : isCaptureMode ? (
        <CaptureWalkthroughCanvas initialTimeMs={fixedWalkthroughTime ?? 0} />
      ) : fixedWalkthroughTime !== null ? (
        <>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              outputColorSpace: THREE.SRGBColorSpace,
              preserveDrawingBuffer: true,
            }}
          >
            <WalkthroughScene timeMs={fixedWalkthroughTime} />
          </Canvas>
          <CutFade timeMs={fixedWalkthroughTime} />
          <RoomLabel timeMs={fixedWalkthroughTime} />
        </>
      ) : (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            preserveDrawingBuffer: true,
          }}
        >
          <DebugScene view={view} />
        </Canvas>
      )}
      {!isWalkthrough && view.type === "top" ? <div className="checkpoint-view-label">{view.title}</div> : null}
    </div>
  );
}

Object.values(modelUrls).forEach((url) => useGLTF.preload(url));
Object.values(polyModelUrls).forEach((url) => useGLTF.preload(url));
