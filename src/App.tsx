import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import * as ReactDOM from "react-dom/client";
import { TimelineRoot } from "@editframe/react";
import { getProject, projects, type ProjectDef } from "./projects";
import { ProjectPicker } from "./ProjectPicker";

const DEFAULT_PROJECT_ID = projects[0].id;

const readProjectFromUrl = (): string | undefined =>
  new URLSearchParams(window.location.search).get("project") ?? undefined;

const writeProjectToUrl = (id: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("project", id);
  window.history.replaceState(null, "", url);
};

/**
 * Mounts a single project's composition in its own, fully isolated React root
 * (rather than as JSX children of the workbench's own tree).
 *
 * `<Timegroup workbench>` self-wraps by *imperatively* moving its own DOM node
 * out from under wherever React put it (into a new `ef-workbench`/`ef-canvas`
 * it creates and appends itself -- see EFTimegroup's `wrapWithWorkbench()`).
 * If that timegroup were a normal descendant of the picker's own React tree,
 * switching projects (unmounting the old composition, mounting the new one)
 * would have React's reconciler try to remove a DOM node from the parent it
 * originally rendered it into, which no longer matches after that imperative
 * move -- a `NotFoundError: Failed to execute 'removeChild'`. Giving each
 * composition its own disposable root + container sidesteps that entirely:
 * tearing one down is just `root.unmount()` + removing the container, exactly
 * like closing a browser tab, independent of the workbench shell's own tree.
 *
 * Only used in dev/preview mode, where projects can be swapped at runtime --
 * render mode (see `main.tsx`'s `virtual:editframe-render-entry` import)
 * mounts the target composition directly with no picker.
 */
const ProjectStage = ({ project }: { project: ProjectDef }) => {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let disposed = false;
    const container = document.createElement("div");
    container.style.display = "contents";
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    let root: ReactDOM.Root | null = null;

    Promise.all([project.loadVideo(), project.loadStylesUrl()]).then(([Component, url]) => {
      if (disposed) return;
      styleLink.href = url;
      document.head.appendChild(styleLink);
      stage.appendChild(container);
      root = ReactDOM.createRoot(container);
      root.render(<TimelineRoot id="composition-root" component={Component} />);
    });

    return () => {
      disposed = true;
      root?.unmount();
      container.remove();
      styleLink.remove();
    };
  }, [project]);

  return <div ref={stageRef} style={{ display: "contents" }} />;
};

/** Dev/preview mode: mounts the active project plus a floating picker overlay. */
const DevWorkbench = () => {
  const [activeId, setActiveId] = useState<string>(
    () => readProjectFromUrl() ?? DEFAULT_PROJECT_ID
  );
  const project = useMemo(() => getProject(activeId) ?? projects[0], [activeId]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    writeProjectToUrl(id);
  };

  return (
    <>
      <ProjectStage key={project.id} project={project} />
      <ProjectPicker activeId={project.id} onSelect={handleSelect} />
    </>
  );
};

export const App = ({ renderVideo }: { renderVideo: ComponentType | null }) => {
  // Render mode: the CLI needs a single ef-timegroup at the top of the
  // document with no picker chrome, matching what each example's own
  // standalone index.html rendered before this repo was consolidated.
  if (renderVideo) {
    return <TimelineRoot id="composition-root" component={renderVideo} />;
  }

  return <DevWorkbench />;
};
