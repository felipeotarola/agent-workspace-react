import { Button } from "./ui/Button";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
export type RailItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
};
/** Shared compact rail for both panel edges. */
export function PanelRail({
  label,
  toggleLabel,
  icon: Icon,
  onToggle,
  items,
  footer,
}: {
  label: string;
  toggleLabel: string;
  icon: LucideIcon;
  onToggle: () => void;
  items: RailItem[];
  footer?: ReactNode;
}) {
  return (
    <nav className="panel-rail" aria-label={label}>
      <span className="rail-brand" aria-hidden="true">
        A
      </span>
      <Button
        shape="icon"
        className="rail-button rail-toggle"
        aria-label={toggleLabel}
        title={toggleLabel}
        onClick={onToggle}
      >
        <Icon size={18} />
      </Button>
      <div className="rail-items">
        {items.map(({ label: name, icon: ItemIcon, onClick, active }) => (
          <Button
            shape="icon"
            className={`rail-button ${active ? "active" : ""}`}
            key={name}
            title={name}
            aria-label={name}
            aria-current={active ? "page" : undefined}
            onClick={onClick}
          >
            <ItemIcon size={18} />
          </Button>
        ))}
      </div>
      <div className="rail-footer">{footer}</div>
    </nav>
  );
}
