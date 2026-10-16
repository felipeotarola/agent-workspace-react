import { useState } from "react";
import {
  LayoutGrid,
  Bot,
  Plug,
  House,
  CirclePlus,
  Search,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { Thread } from "../lib/chat";
const globalLinks: [LucideIcon, string][] = [
  [LayoutGrid, "Alla workspaces"],
  [Bot, "Agenten"],
  [Plug, "Integrationer"],
];
const workspaceLinks: [LucideIcon, string][] = [[House, "Översikt"]];
type Props = {
  threads: Thread[];
  activeId: string;
  view: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onView: (view: string) => void;
};
export function Sidebar({
  threads,
  activeId,
  view,
  onSelect,
  onNew,
  onView,
}: Props) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const filtered = threads.filter((t) =>
    t.title.toLocaleLowerCase("sv").includes(query.toLocaleLowerCase("sv")),
  );
  return (
    <nav className="sidebar-nav">
      <section className="nav-group" aria-label="Globalt">
        <h2 className="nav-section-title">Globalt</h2>
        {globalLinks.map(([Icon, label]) => (
          <button
            key={label}
            className={`nav-link ${view === label ? "active" : ""}`}
            onClick={() => onView(label)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </section>
      <section className="nav-group" aria-label="Workspace">
        <h2 className="nav-section-title">Workspace</h2>
        <div className="workspace-select">
          <span className="workspace-avatar">A</span>
          <select aria-label="Välj workspace">
            <option>Min workspace</option>
          </select>
        </div>
        {workspaceLinks.map(([Icon, label]) => (
          <button
            key={label}
            className={`nav-link ${view === label ? "active" : ""}`}
            onClick={() => onView(label)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </section>
      <section className="nav-group chat-list" aria-label="Chattar">
        <h2 className="nav-section-title">
          Chattar<span className="summary-count">{threads.length}</span>
        </h2>
        <button className="nav-link" onClick={onNew}>
          <CirclePlus />
          Ny chatt
        </button>
        <button
          className="nav-link"
          aria-expanded={searching}
          onClick={() => setSearching(!searching)}
        >
          <Search />
          Sök chattar
        </button>
        {searching && (
          <input
            autoFocus
            className="search-input"
            aria-label="Sök chattar"
            placeholder="Sök en chatt…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <div className="thread-list">
          {filtered.map((t) => (
            <button
              key={t.id}
              className={`nav-link thread ${activeId === t.id ? "active" : ""}`}
              aria-current={activeId === t.id ? "page" : undefined}
              onClick={() => onSelect(t.id)}
            >
              <MessageSquare />
              <span>{t.title}</span>
            </button>
          ))}
          {query && !filtered.length && (
            <p className="no-results">Inga chattar hittades.</p>
          )}
        </div>
      </section>
    </nav>
  );
}
