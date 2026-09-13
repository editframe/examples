export const FPS = 60;
export const FRAMES = { invoice: 236, spend: 200, separation: 326, investigation: 360, workItems: 378 } as const;
export const duration = (frames: number) => `${frames / FPS}s`;
