import { eveChannel } from "eve/channels/eve";
import { appAuth } from "../../server/auth.ts";

export default eveChannel({ auth: appAuth });
