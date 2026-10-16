import { useLiveAgent } from "./useLiveAgent";
import { useMockAgent } from "./useMockAgent";

// An explicit design-preview mode. Backend failures never fall back to mocks.
export const useAgent = import.meta.env.VITE_AGENT_MODE === "mock" ? useMockAgent : useLiveAgent;
