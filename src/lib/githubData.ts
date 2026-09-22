import raw from "virtual:github-data";
import type { GithubData } from "@/data/github";

// Repo data fetched when the site builds (scripts/github-data.ts).
export const github = raw as GithubData;
