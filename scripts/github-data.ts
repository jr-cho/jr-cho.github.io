import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import type { GithubData } from "../src/data/github";

const USER = "jr-cho";

// Repos kept off the site: editor and shell configs, the profile README,
// and this website itself.
const HIDDEN = new Set(["nvim", "tmux-and-neovim-config", "vimtex-config", "jr-cho", "jr-cho.github.io"]);

// How many recently updated repos to show.
const RECENT = 6;

// Reuse fetched data for this long in development, so restarts do not
// spend GitHub's hourly request limit.
const CACHE_MS = 6 * 60 * 60 * 1000;
const CACHE_FILE = path.resolve("node_modules/.cache/github-data.json");

const EMPTY: GithubData = { repos: [], languages: [] };

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  private: boolean;
  archived: boolean;
};

async function api<T>(url: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": `${USER}-site-build`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function fetchData(): Promise<GithubData> {
  const all = await api<ApiRepo[]>(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`);
  const shown = all
    .filter((r) => !r.fork && !r.private && !r.archived && !HIDDEN.has(r.name))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

  // Sum the bytes of each language across every shown repo.
  const totals = new Map<string, number>();
  for (const repo of shown) {
    const langs = await api<Record<string, number>>(`https://api.github.com/repos/${USER}/${repo.name}/languages`);
    for (const [name, bytes] of Object.entries(langs)) totals.set(name, (totals.get(name) ?? 0) + bytes);
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 5).map(([name, bytes]) => ({ name, share: Math.round((bytes / sum) * 1000) / 10 }));
  const rest = ranked.slice(5).reduce((a, [, bytes]) => a + bytes, 0);
  const languages = rest > 0 ? [...top, { name: "Other", share: Math.round((rest / sum) * 1000) / 10 }] : top;

  const repos = shown.slice(0, RECENT).map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    url: r.html_url,
    pushedAt: r.pushed_at,
  }));

  return { repos, languages };
}

async function readCache(): Promise<{ at: number; data: GithubData } | null> {
  try {
    return JSON.parse(await readFile(CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}

// Fetches repo data once per build (or from the dev cache) and serves it
// as the module "virtual:github-data". A failed fetch falls back to the
// last cached data, then to empty lists, so the build never breaks.
export function githubData(): Plugin {
  const id = "virtual:github-data";
  const resolved = "\0" + id;
  let data: Promise<GithubData> | null = null;

  const load = async (dev: boolean): Promise<GithubData> => {
    const cached = await readCache();
    if (dev && cached && Date.now() - cached.at < CACHE_MS) return cached.data;
    try {
      const fresh = await fetchData();
      await mkdir(path.dirname(CACHE_FILE), { recursive: true });
      await writeFile(CACHE_FILE, JSON.stringify({ at: Date.now(), data: fresh }));
      return fresh;
    } catch (err) {
      console.warn(`[github-data] ${(err as Error).message}. Using ${cached ? "cached" : "empty"} data.`);
      return cached?.data ?? EMPTY;
    }
  };

  let dev = false;
  return {
    name: "github-data",
    configResolved(config) {
      dev = config.command === "serve";
    },
    resolveId(source) {
      return source === id ? resolved : null;
    },
    async load(loadId) {
      if (loadId !== resolved) return null;
      data ??= load(dev);
      return `export default ${JSON.stringify(await data)};`;
    },
  };
}
