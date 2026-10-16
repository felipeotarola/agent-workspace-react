import { localDev, placeholderAuth } from "eve/channels/auth";

// One policy for the browser API and agent API. Production rejects requests
// until an app-session verifier is added here. Never trust a client user ID.
export const appAuth = [localDev(), placeholderAuth()];
