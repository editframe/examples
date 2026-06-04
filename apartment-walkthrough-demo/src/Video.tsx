import React from "react";
import { Timegroup } from "@editframe/react";
import { ApartmentScene, WALKTHROUGH_DURATION_SECONDS } from "./scene/FinalApartmentScene";

type EFRenderApi = {
  __apartmentGateInstalled?: boolean;
  render?: (options?: unknown) => Promise<unknown>;
  renderStreaming?: (options?: unknown) => Promise<unknown>;
};

declare global {
  interface Window {
    EF_RENDER?: EFRenderApi;
    __APARTMENT_SCENE_READY?: boolean;
  }
}

const waitForApartmentSceneReady = async () => {
  const timeoutAt = Date.now() + 90000;
  while (!window.__APARTMENT_SCENE_READY) {
    if (Date.now() > timeoutAt) {
      throw new Error("Apartment 3D scene was not ready before render capture started.");
    }
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};

const installApartmentRenderGate = () => {
  if (typeof window === "undefined") return;
  window.__APARTMENT_SCENE_READY = false;

  const patch = () => {
    const api = window.EF_RENDER;
    if (!api || api.__apartmentGateInstalled) return Boolean(api);

    const render = api.render?.bind(api);
    const renderStreaming = api.renderStreaming?.bind(api);
    if (render) {
      api.render = async (options?: unknown) => {
        await waitForApartmentSceneReady();
        return render(options);
      };
    }
    if (renderStreaming) {
      api.renderStreaming = async (options?: unknown) => {
        await waitForApartmentSceneReady();
        return renderStreaming(options);
      };
    }
    api.__apartmentGateInstalled = true;
    return true;
  };

  if (patch()) return;
  const interval = window.setInterval(() => {
    if (patch()) window.clearInterval(interval);
  }, 20);
  window.setTimeout(() => window.clearInterval(interval), 10000);
};

installApartmentRenderGate();

export const Video = () => {
  const fixedTimeParam = new URLSearchParams(window.location.search).get("fixedTimeMs");
  const fixedTimeMs = fixedTimeParam === null ? undefined : Number(fixedTimeParam);

  return (
    <Timegroup
      workbench
      className="w-[1920px] h-[1080px] bg-[#d9d1c4] relative overflow-hidden"
      mode="fixed"
      duration={`${WALKTHROUGH_DURATION_SECONDS}s`}
    >
      <ApartmentScene mode="walkthrough" timeMs={Number.isFinite(fixedTimeMs) ? fixedTimeMs : undefined} />
    </Timegroup>
  );
};
