import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { EFWorkbenchElement } from "@editframe/elements";
import { projects, type ProjectDef } from "./projects";

interface ProjectPickerProps {
  /** The live workbench hosting the active composition (null while a project is mounting). */
  workbench: EFWorkbenchElement | null;
  activeId: string;
  onSelect: (id: string) => void;
}

const PosterThumb = ({ project, size = "row" }: { project: ProjectDef; size?: "row" | "button" }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!project.loadPosterUrl) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    project.loadPosterUrl().then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [project]);

  const dims =
    size === "button"
      ? project.aspect === "portrait"
        ? "h-[18px] w-[10px]"
        : "h-[18px] w-8"
      : project.aspect === "portrait"
        ? "h-14 w-8"
        : "h-11 w-[76px]";

  return (
    <div
      className={`relative ${dims} shrink-0 overflow-hidden rounded border border-black/20 bg-neutral-800`}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wide text-neutral-500">
          {project.aspect === "portrait" ? "9:16" : "16:9"}
        </div>
      )}
    </div>
  );
};

/**
 * The picker's trigger + dropdown. Rendered as light DOM inside
 * `<ef-workbench>` (via the portal in `ProjectPicker` below), so it picks up
 * the workbench's `--ef-color-*` theme custom properties and flips between
 * its light/dark themes along with the rest of the chrome.
 */
const PickerDropdown = ({ activeId, onSelect }: Omit<ProjectPickerProps, "workbench">) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  const active = projects.find((p) => p.id === activeId);

  const positionPopover = () => {
    const button = buttonRef.current;
    const popover = popoverRef.current;
    if (!button || !popover) return;
    const rect = button.getBoundingClientRect();
    popover.style.top = `${rect.bottom + 6}px`;
    popover.style.left = `${rect.left}px`;
  };

  const openPopover = () => {
    const popover = popoverRef.current;
    if (!popover || open) return;
    positionPopover();
    popover.showPopover();
    setQuery("");
    setHighlight(0);
    setOpen(true);
  };

  const closePopover = () => {
    const popover = popoverRef.current;
    if (!popover || !open) return;
    popover.hidePopover();
    setOpen(false);
  };

  const select = (id: string) => {
    onSelect(id);
    closePopover();
  };

  const onSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (filtered.length === 0) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setHighlight((h) => (h + delta + filtered.length) % filtered.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = filtered[highlight] ?? filtered[0];
      if (target) select(target.id);
    }
  };

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${highlight}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? closePopover() : openPopover())}
        title="Switch example project"
        className="flex h-7 items-center gap-2 rounded border border-(--ef-color-border-subtle) bg-(--ef-color-bg-inset) px-2 text-[13px] font-medium text-(--ef-color-text) transition hover:bg-(--ef-color-hover)"
      >
        {active && <PosterThumb project={active} size="button" />}
        <span className="max-w-64 truncate">{active?.title ?? activeId}</span>
        <span className="text-[10px] text-(--ef-color-text-muted)">{open ? "▲" : "▼"}</span>
      </button>

      <div
        ref={(el) => {
          popoverRef.current = el;
          // React 18 doesn't know the `popover` attribute — set it
          // imperatively (it IS the standard HTML popover API).
          if (el && el.popover !== "auto") el.popover = "auto";
        }}
        onToggle={(e) => {
          // Native light-dismiss (outside click / Escape) → mirror state.
          const nowOpen = (e as unknown as ToggleEvent).newState === "open";
          if (!nowOpen) setOpen(false);
        }}
        className="m-0 w-105 max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-(--ef-color-border) bg-(--ef-color-bg-elevated) p-0 text-(--ef-color-text) shadow-2xl"
        style={{ position: "fixed", inset: "auto" }}
      >
        <div className="border-b border-(--ef-color-border-subtle) p-2.5">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder={`Search ${projects.length} examples…  (↑↓ navigate, ↵ open)`}
            className="w-full rounded-md border border-(--ef-color-border-subtle) bg-(--ef-color-bg-inset) px-3 py-1.5 text-[13px] text-(--ef-color-text) placeholder:text-(--ef-color-text-subtle) focus:border-(--ef-color-primary) focus:outline-none"
          />
        </div>
        <div ref={listRef} className="max-h-[70vh] overflow-y-auto p-1.5">
          {filtered.length === 0 && (
            <div className="p-4 text-center text-[13px] text-(--ef-color-text-subtle)">
              No matches
            </div>
          )}
          {filtered.map((project, i) => (
            <button
              key={project.id}
              type="button"
              data-index={i}
              onClick={() => select(project.id)}
              onMouseEnter={() => setHighlight(i)}
              className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition ${
                i === highlight ? "bg-(--ef-color-hover)" : ""
              } ${
                project.id === activeId ? "ring-1 ring-(--ef-color-primary)" : ""
              }`}
            >
              <PosterThumb project={project} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-(--ef-color-text)">
                  {project.title}
                </div>
                <div className="truncate text-xs text-(--ef-color-text-muted)">
                  {project.description}
                </div>
              </div>
              <div className="shrink-0 text-xs text-(--ef-color-text-subtle)">
                {project.duration}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/**
 * Mounts the picker into the workbench's header via its `toolbar-start`
 * extension slot. The workbench is created imperatively — the composition's
 * root `<ef-timegroup workbench>` wraps *itself* in an `<ef-workbench>` when
 * it connects — so App hands us the element once it appears, and we portal
 * into a light-DOM child carrying `slot="toolbar-start"`. Keeping the picker
 * in the workbench's light DOM (rather than its shadow tree) is what lets
 * this page's Tailwind stylesheet style it.
 */
export const ProjectPicker = ({ workbench, activeId, onSelect }: ProjectPickerProps) => {
  const [slotTarget, setSlotTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!workbench) return;
    const el = document.createElement("div");
    el.setAttribute("slot", "toolbar-start");
    workbench.appendChild(el);
    setSlotTarget(el);
    return () => {
      el.remove();
      setSlotTarget(null);
    };
  }, [workbench]);

  if (!slotTarget) return null;
  return createPortal(
    <PickerDropdown activeId={activeId} onSelect={onSelect} />,
    slotTarget,
  );
};
