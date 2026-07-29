// Ambient declaration so tool files (which run in Deno at runtime) can
// reference process.env during typecheck without pulling @types/node.
declare const process: {
  env: Record<string, string | undefined>;
};
