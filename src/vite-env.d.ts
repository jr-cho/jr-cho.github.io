/// <reference types="vite/client" />

declare module "@fontsource-variable/geist";
declare module "@fontsource-variable/geist-mono";

// Repo data fetched at build time. Read it through the types in src/data/github.ts.
declare module "virtual:github-data" {
  const data: unknown;
  export default data;
}
