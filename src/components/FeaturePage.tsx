import {
  Bot,
  Plug,
  GitFork,
  MessageSquare,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { lazy, Suspense } from "react";
const AgentDiagram = lazy(() => import("./AgentDiagram"));
const integrations: { name: string; description: string; icon: LucideIcon }[] =
  [
    {
      name: "GitHub",
      description: "Repositories och kod på samma plats.",
      icon: GitFork,
    },
    {
      name: "Slack",
      description: "Håll ihop samtal och samarbete.",
      icon: MessageSquare,
    },
    {
      name: "Linear",
      description: "Samla projekt och uppgifter.",
      icon: Layers,
    },
  ];
export function FeaturePage({ view, dark }: { view: string; dark: boolean }) {
  const isAgent = view === "Agenten";
  const Icon = isAgent ? Bot : Plug;
  return (
    <section className="feature-page" aria-label={view}>
      <header className="feature-page-heading">
        <span className="feature-page-icon">
          <Icon size={22} />
        </span>
        <h1>{view}</h1>
        <p>
          {isAgent
            ? "Din personliga assistent, redo när du är."
            : "Dina verktyg, samlade på ett ställe."}
        </p>
      </header>
      {isAgent ? (
        <Suspense
          fallback={
            <div className="agent-diagram-loading" role="status">
              Laddar diagram…
            </div>
          }
        >
          <AgentDiagram dark={dark} />
        </Suspense>
      ) : (
        <section
          className="feature-card"
          aria-label="Tillgängliga integrationer"
        >
          <div className="feature-card-heading">
            <div>
              <h2>Integrationer</h2>
              <p>Inga integrationer är anslutna i den här demon.</p>
            </div>
          </div>
          <div className="integration-list">
            {integrations.map(({ name, description, icon: ProviderIcon }) => (
              <div className="integration-row" key={name}>
                <ProviderIcon size={21} />
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <span className="integration-status">Ej ansluten</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
