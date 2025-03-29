import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
export const auth = createAuthClient({
  plugins: [jwtClient()],
});
