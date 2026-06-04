export type FloorKind = "common" | "bedroom" | "wet" | "balcony" | "passage";

export type Room = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  floor: FloorKind;
  showLabel?: boolean;
};

export type WallKind = "exterior" | "interior" | "railing";

export type WallSegment = {
  id: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  height?: number;
  kind?: WallKind;
};

export type WindowSegment = {
  id: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  height?: number;
  sill?: number;
  label?: string;
};

export type DoorMarker = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  rotation: number;
};

const wall = (
  id: string,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  kind: WallKind = "interior",
  height = 9.75,
): WallSegment => ({ id, x1, z1, x2, z2, kind, height });

const windowSeg = (
  id: string,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  label?: string,
): WindowSegment => ({ id, x1, z1, x2, z2, label, sill: 2.5, height: 5.25 });

export const WALL_HEIGHT = 9.75;
export const RAILING_HEIGHT = 3.1;
export const WALL_THICKNESS = 0.34;

export const apartmentBounds = {
  minX: -1.5,
  maxX: 48,
  minZ: -1.5,
  maxZ: 44.8,
  centerX: 23.25,
  centerZ: 21.65,
};

export const rooms: Room[] = [
  { id: "foyer", label: "Foyer", x: 30.5, z: 0, width: 5, depth: 8.67, floor: "common" },
  { id: "kitchen", label: "Kitchen", x: 18, z: 0, width: 10.33, depth: 8.67, floor: "common" },
  { id: "utility", label: "Utility", x: 13, z: 0, width: 5, depth: 8.17, floor: "wet" },
  { id: "dining", label: "Dining", x: 18, z: 8.67, width: 10.83, depth: 10.83, floor: "common" },
  { id: "living", label: "Living Room", x: 24, z: 19.5, width: 11, depth: 19, floor: "common" },
  { id: "living-balcony", label: "Balcony", x: 24.25, z: 38.5, width: 10.5, depth: 4.92, floor: "balcony" },
  { id: "bedroom-1", label: "Bedroom 1", x: 36, z: 25, width: 10.5, depth: 13.5, floor: "bedroom" },
  { id: "wardrobe", label: "Wardrobe", x: 36, z: 16.6, width: 5, depth: 8.4, floor: "passage" },
  { id: "bedroom-1-toilet", label: "A. Toilet", x: 41.2, z: 16.8, width: 5.3, depth: 8, floor: "wet" },
  { id: "bedroom-2", label: "Bedroom 2", x: 13, z: 25, width: 10, depth: 12.83, floor: "bedroom" },
  { id: "common-toilet", label: "C. Toilet", x: 9, z: 8.67, width: 7.83, depth: 5.5, floor: "wet" },
  { id: "master-bedroom", label: "Master Bedroom", x: 0, z: 20, width: 11, depth: 13.5, floor: "bedroom" },
  { id: "master-balcony", label: "Master Balcony", x: 0.2, z: 33.5, width: 10.75, depth: 4.5, floor: "balcony" },
  { id: "master-toilet", label: "M. Toilet", x: 0, z: 14.5, width: 8, depth: 5.5, floor: "wet" },
  { id: "left-passage", label: "Passage", x: 8, z: 14.17, width: 10, depth: 5.83, floor: "passage", showLabel: false },
  { id: "upper-passage", label: "Passage", x: 11, z: 19.5, width: 13, depth: 5.5, floor: "passage", showLabel: false },
  { id: "dining-link", label: "Dining Link", x: 28.83, z: 8.67, width: 1.67, depth: 10.83, floor: "common", showLabel: false },
];

export const wallSegments: WallSegment[] = [
  wall("utility-left", 13, 0, 13, 8.17, "exterior"),
  wall("utility-bottom", 13, 0, 18, 0, "exterior"),
  wall("utility-top", 13, 8.17, 18, 8.17),
  wall("utility-kitchen-lower", 18, 0, 18, 3),
  wall("utility-kitchen-upper", 18, 5.7, 18, 8.67),

  wall("kitchen-bottom", 18, 0, 28.33, 0, "exterior"),
  wall("kitchen-right", 28.33, 0, 28.33, 8.67),
  wall("kitchen-top-left", 18, 8.67, 20.2, 8.67),
  wall("kitchen-top-right", 25.2, 8.67, 28.33, 8.67),

  wall("foyer-left", 30.5, 0, 30.5, 8.67),
  wall("foyer-right", 35.5, 0, 35.5, 8.67, "exterior"),
  wall("foyer-bottom-left", 30.5, 0, 32.1, 0, "exterior"),
  wall("foyer-bottom-right", 34.1, 0, 35.5, 0, "exterior"),
  wall("foyer-top-left", 30.5, 8.67, 31.4, 8.67),
  wall("foyer-top-right", 34.3, 8.67, 35.5, 8.67),

  wall("common-toilet-left", 9, 8.67, 9, 14.17),
  wall("common-toilet-bottom", 9, 8.67, 16.83, 8.67),
  wall("common-toilet-top", 9, 14.17, 16.83, 14.17),
  wall("common-toilet-right-lower", 16.83, 8.67, 16.83, 10.05),
  wall("common-toilet-right-upper", 16.83, 12.85, 16.83, 14.17),

  wall("master-toilet-left", 0, 14.5, 0, 20, "exterior"),
  wall("master-toilet-bottom", 0, 14.5, 8, 14.5, "exterior"),
  wall("master-toilet-right", 8, 14.5, 8, 20),
  wall("master-toilet-top-left", 0, 20, 2.2, 20),
  wall("master-toilet-top-right", 5.2, 20, 8, 20),

  wall("master-left", 0, 20, 0, 33.5, "exterior"),
  wall("master-bottom-left", 0, 20, 2.2, 20),
  wall("master-bottom-right", 5.2, 20, 11, 20),
  wall("master-right-lower", 11, 20, 11, 21.2),
  wall("master-right-upper", 11, 24.2, 11, 33.5),
  wall("master-top-left", 0, 33.5, 1.4, 33.5, "exterior"),
  wall("master-top-right", 9.6, 33.5, 11, 33.5, "exterior"),

  wall("master-balcony-left-rail", 0.2, 33.5, 0.2, 38, "railing", RAILING_HEIGHT),
  wall("master-balcony-top-rail", 0.2, 38, 10.95, 38, "railing", RAILING_HEIGHT),
  wall("master-balcony-right-rail", 10.95, 33.5, 10.95, 38, "railing", RAILING_HEIGHT),

  wall("bedroom2-left", 13, 25, 13, 37.83, "exterior"),
  wall("bedroom2-right", 23, 25, 23, 37.83),
  wall("bedroom2-bottom-left", 13, 25, 16, 25),
  wall("bedroom2-bottom-right", 19, 25, 23, 25),
  wall("bedroom2-top-left", 13, 37.83, 15.2, 37.83, "exterior"),
  wall("bedroom2-top-right", 21, 37.83, 23, 37.83, "exterior"),

  wall("living-left", 24, 25, 24, 38.5),
  wall("living-right-lower", 35, 19.5, 35, 20.6),
  wall("living-right-upper", 35, 23.6, 35, 38.5),
  wall("living-top-left", 24, 38.5, 26, 38.5, "exterior"),
  wall("living-top-right", 33, 38.5, 35, 38.5, "exterior"),
  wall("living-bottom-right", 30.5, 19.5, 35, 19.5),

  wall("living-balcony-left-rail", 24.25, 38.5, 24.25, 43.42, "railing", RAILING_HEIGHT),
  wall("living-balcony-top-rail", 24.25, 43.42, 34.75, 43.42, "railing", RAILING_HEIGHT),
  wall("living-balcony-right-rail", 34.75, 38.5, 34.75, 43.42, "railing", RAILING_HEIGHT),

  wall("bed1-left-lower", 36, 16.6, 36, 20.6),
  wall("bed1-left-upper", 36, 23.6, 36, 38.5),
  wall("wardrobe-bottom", 36, 16.6, 41, 16.6),
  wall("wardrobe-right-lower", 41, 16.6, 41, 18.4),
  wall("wardrobe-right-upper", 41, 21.4, 41, 25),
  wall("wardrobe-top-left", 36, 25, 38, 25),
  wall("wardrobe-top-right", 41, 25, 41.2, 25),

  wall("bed1-bottom-left", 36, 25, 38, 25),
  wall("bed1-bottom-right", 41, 25, 46.5, 25),
  wall("bed1-right", 46.5, 25, 46.5, 38.5, "exterior"),
  wall("bed1-top-left", 36, 38.5, 38, 38.5, "exterior"),
  wall("bed1-top-right", 44, 38.5, 46.5, 38.5, "exterior"),

  wall("bed1-toilet-bottom", 41.2, 16.8, 46.5, 16.8, "exterior"),
  wall("bed1-toilet-right", 46.5, 16.8, 46.5, 24.8, "exterior"),
  wall("bed1-toilet-top", 41.2, 24.8, 46.5, 24.8),
  wall("bed1-toilet-left-lower", 41.2, 16.8, 41.2, 18.4),
  wall("bed1-toilet-left-upper", 41.2, 21.4, 41.2, 24.8),
];

export const windowSegments: WindowSegment[] = [
  windowSeg("master-balcony-slider", 1.4, 33.52, 9.6, 33.52, "Master balcony slider"),
  windowSeg("living-balcony-slider", 26, 38.52, 33, 38.52, "Living balcony slider"),
  windowSeg("bedroom2-window", 15.2, 37.85, 21, 37.85, "Bedroom 2 window"),
  windowSeg("bedroom1-window", 38, 38.52, 44, 38.52, "Bedroom 1 window"),
  windowSeg("kitchen-window", 20.2, 0.02, 24.2, 0.02, "Kitchen window"),
  windowSeg("common-toilet-window", 10.2, 8.69, 15.2, 8.69, "Common toilet window"),
  windowSeg("master-toilet-window", 1.6, 14.52, 6, 14.52, "Master toilet window"),
  windowSeg("bed1-toilet-window", 46.48, 18.2, 46.48, 22.8, "Bedroom 1 toilet window"),
];

export const doorMarkers: DoorMarker[] = [
  { id: "main-door", label: "Main Door", x: 33.1, z: 0.25, width: 2.2, rotation: Math.PI / 2.8 },
  { id: "foyer-door", label: "Foyer Door", x: 32.9, z: 8.45, width: 2.8, rotation: -Math.PI / 5 },
  { id: "utility-door", label: "Utility Door", x: 18.12, z: 4.35, width: 2.6, rotation: Math.PI / 1.9 },
  { id: "common-toilet-door", label: "Common Toilet Door", x: 16.63, z: 11.45, width: 2.6, rotation: -Math.PI / 7 },
  { id: "master-door", label: "Master Door", x: 10.8, z: 22.7, width: 2.8, rotation: -Math.PI / 2.7 },
  { id: "master-toilet-door", label: "Master Toilet Door", x: 3.7, z: 20.2, width: 2.8, rotation: Math.PI / 5 },
  { id: "bedroom2-door", label: "Bedroom 2 Door", x: 17.5, z: 25.2, width: 2.8, rotation: Math.PI / 5 },
  { id: "bedroom1-entry", label: "Bedroom 1 Entry", x: 35.8, z: 22.1, width: 2.8, rotation: -Math.PI / 3.2 },
  { id: "bedroom1-door", label: "Bedroom 1 Door", x: 39.5, z: 25.2, width: 2.8, rotation: Math.PI / 5 },
  { id: "bedroom1-toilet-door", label: "Attached Toilet Door", x: 41.0, z: 19.9, width: 2.6, rotation: -Math.PI / 2.4 },
];
