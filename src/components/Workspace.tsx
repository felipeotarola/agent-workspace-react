import { House, ListChecks, FolderOpen, type LucideIcon } from "lucide-react";
const tabs: [LucideIcon, string][] = [
  [House, "Översikt"],
  [ListChecks, "Testning"],
  [FolderOpen, "Material"],
];
export function Workspace({
  view,
  onView,
}: {
  view: string;
  onView: (view: string) => void;
}) {
  return (
    <aside className="workspace-pane" aria-label="Workspace">
      <header className="workspace-header">
        <div className="workspace-heading">
          <span className="workspace-avatar">S</span>
          <span>Min workspace</span>
        </div>
        <nav aria-label="Workspace-vyer">
          {tabs.map(([Icon, label]) => (
            <button
              key={label}
              className={view === label ? "selected" : ""}
              aria-current={view === label ? "page" : undefined}
              onClick={() => onView(label)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </header>
      <div
        className="workspace-canvas"
        aria-label={`${view} – tom arbetsyta`}
      />
    </aside>
  );
}
