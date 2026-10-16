import { defineAgent } from "eve";
import { agentModel } from "../shared/agent-config.ts";

export default defineAgent({
  model: agentModel,
  reasoning: "high",
  defaultTools: false,
  tool: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 15_000 },
});
