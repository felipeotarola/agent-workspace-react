import {
  Bot,
  Plug,
  GitFork,
  MessageSquare,
  Layers,
  type LucideIcon,
} from "lucide-react";
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
export function FeaturePage({ view }: { view: string }) {
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
        <article className="feature-card">
          <div className="feature-card-heading">
            <span className="feature-page-icon">
              <Bot size={22} />
            </span>
            <div>
              <h2>Agent Workspace</h2>
              <p>Din personliga assistent</p>
            </div>
            <span className="demo-badge">Demo</span>
          </div>
          <p>
            Bolla idéer, strukturera en uppgift eller skissa på en plan i
            chatten.
          </p>
          <div className="feature-meta">
            <span>Simulerade svar</span>
            <span>Lokal chatthistorik</span>
          </div>
        </article>
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
