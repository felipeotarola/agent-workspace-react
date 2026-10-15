import { useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeft,
  PanelRight,
  Menu,
  Moon,
  Sun,
  X,
  PanelsTopLeft,
} from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Chat } from "./components/Chat";
import { Workspace } from "./components/Workspace";
import { loadThreads, saveThreads, newThread, type Thread } from "./lib/chat";
import "./App.css";

export default function App() {
  const [threads, setThreads] = useState<Thread[]>(loadThreads);
  const [activeId, setActiveId] = useState(() => threads[0].id);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [pane, setPane] = useState("chat");
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [view, setView] = useState("Översikt");
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("syna-theme") === "dark";
    } catch {
      return false;
    }
  });
  const [chatWidth, setChatWidth] = useState(48);
  const split = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("syna-theme", dark ? "dark" : "light");
    } catch {
      /* Storage may be disabled. */
    }
  }, [dark]);
  useEffect(() => {
    if (mobileNav) drawer.current?.showModal();
    else drawer.current?.close();
  }, [mobileNav]);
  function createChat() {
    const thread = newThread();
    setThreads((prev) => [thread, ...prev]);
    setActiveId(thread.id);
    setPane("chat");
    setMobileNav(false);
  }
  function openView(next: string) {
    setView(next);
    setPane("workspace");
    setWorkspaceOpen(true);
    setMobileNav(false);
  }
  const sidebar = (
    <Sidebar
      threads={threads}
      activeId={active.id}
      view={view}
      onSelect={(id) => {
        setActiveId(id);
        setPane("chat");
        setMobileNav(false);
      }}
      onNew={createChat}
      onView={openView}
    />
  );
  return (
    <div className={`app-shell ${collapsed ? "nav-collapsed" : ""}`}>
      <aside className="desktop-sidebar" aria-label="Huvudnavigation">
        <div className="brand-row">
          {!collapsed && <Brand />}
          <button
            className="icon-button"
            aria-label={collapsed ? "Visa navigation" : "Dölj navigation"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeft /> : <PanelLeftClose />}
          </button>
        </div>
        {!collapsed && sidebar}
        <button
          className="account"
          onClick={() => setDark(!dark)}
          title="Byt färgtema"
          aria-label="Byt färgtema"
        >
          <span className="avatar">DU</span>
          {!collapsed && (
            <>
              <span className="account-copy">
                <strong>Ditt konto</strong>
                <small>Personlig workspace</small>
              </span>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </>
          )}
        </button>
      </aside>
      <dialog
        ref={drawer}
        className="mobile-drawer"
        onCancel={() => setMobileNav(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileNav(false);
        }}
      >
        <div className="drawer-content">
          <div className="brand-row">
            <Brand />
            <button
              className="icon-button"
              aria-label="Stäng navigation"
              onClick={() => setMobileNav(false)}
            >
              <X />
            </button>
          </div>
          {sidebar}
          <button className="nav-link" onClick={() => setDark(!dark)}>
            {dark ? <Sun /> : <Moon />}Byt färgtema
          </button>
        </div>
      </dialog>
      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-only"
              aria-label="Öppna navigation"
              onClick={() => setMobileNav(true)}
            >
              <Menu />
            </button>
            <PanelsTopLeft size={18} />
            <span>{active.title}</span>
          </div>
          <div className="topbar-actions">
            <span className="demo-badge">Demo</span>
            <button
              className="icon-button"
              aria-label={workspaceOpen ? "Dölj workspace" : "Visa workspace"}
              aria-pressed={workspaceOpen}
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
            >
              <PanelRight />
            </button>
          </div>
        </header>
        <div className="mobile-tabs" role="group" aria-label="Panel">
          <button
            aria-pressed={pane === "chat"}
            onClick={() => setPane("chat")}
          >
            Chatt
          </button>
          <button
            aria-pressed={pane === "workspace"}
            onClick={() => {
              setPane("workspace");
              setWorkspaceOpen(true);
            }}
          >
            Workspace
          </button>
        </div>
        <div
          className={`split-layout ${workspaceOpen ? "" : "workspace-hidden"} mobile-${pane}`}
          ref={split}
          style={{ "--chat-width": `${chatWidth}%` } as React.CSSProperties}
        >
          <Chat
            key={active.id}
            thread={active}
            onChange={(updated) =>
              setThreads((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t)),
              )
            }
          />
          {workspaceOpen && (
            <>
              <div
                className="divider"
                role="separator"
                aria-label="Ändra panelbredd"
                aria-orientation="vertical"
                aria-valuenow={chatWidth}
                aria-valuemin={30}
                aria-valuemax={70}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                    setChatWidth((w) =>
                      Math.min(
                        70,
                        Math.max(30, w + (e.key === "ArrowRight" ? 2 : -2)),
                      ),
                    );
                  }
                }}
                onDoubleClick={() => setChatWidth(48)}
                onPointerDown={(e) =>
                  e.currentTarget.setPointerCapture(e.pointerId)
                }
                onPointerMove={(e) => {
                  if (
                    !e.currentTarget.hasPointerCapture(e.pointerId) ||
                    !split.current
                  )
                    return;
                  const rect = split.current.getBoundingClientRect();
                  setChatWidth(
                    Math.min(
                      70,
                      Math.max(
                        30,
                        ((e.clientX - rect.left) / rect.width) * 100,
                      ),
                    ),
                  );
                }}
                onPointerUp={(e) =>
                  e.currentTarget.releasePointerCapture(e.pointerId)
                }
              />
              <Workspace view={view} onView={openView} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function Brand() {
  return (
    <div className="brand">
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M23 12H12V23M41 12H52V23M12 41V52H23M52 41V52H41"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 32Q32 17 46 32Q32 47 18 32Z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="4.5" fill="currentColor" />
      </svg>
      <span>
        <strong>Syna</strong>
        <small>Agenter & testning</small>
      </span>
    </div>
  );
}
