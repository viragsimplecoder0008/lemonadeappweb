/// <reference types="vite/client" />

// Ambient process typing for MCP tool files that run in Deno at runtime.
declare const process: {
  env: Record<string, string | undefined>;
};
