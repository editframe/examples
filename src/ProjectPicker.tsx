import { useEffect, useMemo, useState } from "react";
import { projects, type ProjectDef } from "./projects";

interface ProjectPickerProps {
  activeId: string;
  onSelect: (id: string) => void;
}

const PosterThumb = ({ project }: { project: ProjectDef }) => {
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

  return (
    <div
      className={`relative h-10 w-16 shrink-0 overflow-hidden rounded bg-neutral-800 ${
        project.aspect === "portrait" ? "aspect-9/16" : "aspect-video"
      }`}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wide text-neutral-500">
          {project.aspect === "portrait" ? "9:16" : "16:9"}
        </div>
      )}
    </div>
  );
};

export const ProjectPicker = ({ activeId, onSelect }: ProjectPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const active = projects.find((p) => p.id === activeId);

  return (
    <div className="fixed top-16 right-4 z-[9999] font-sans text-sm text-neutral-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-2 shadow-lg backdrop-blur transition hover:border-neutral-500"
      >
        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
        <span className="max-w-56 truncate font-medium">{active?.title ?? activeId}</span>
        <span className="text-neutral-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 w-96 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900/95 shadow-2xl backdrop-blur">
          <div className="border-b border-neutral-800 p-3">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${projects.length} examples…`}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-neutral-500">No matches</div>
            )}
            {filtered.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onSelect(project.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                  project.id === activeId
                    ? "bg-emerald-400/10 ring-1 ring-emerald-400/40"
                    : "hover:bg-neutral-800"
                }`}
              >
                <PosterThumb project={project} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-neutral-100">{project.title}</div>
                  <div className="truncate text-xs text-neutral-500">{project.description}</div>
                </div>
                <div className="shrink-0 text-xs text-neutral-500">{project.duration}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
