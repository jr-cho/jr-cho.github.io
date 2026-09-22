// Shape of the repo data fetched at build time (scripts/github-data.ts)
// and served as the module "virtual:github-data".

export interface RepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  pushedAt: string;
}

export interface LanguageShare {
  name: string;
  // Percent of code across the shown repos, rounded to one decimal.
  share: number;
}

export interface GithubData {
  repos: RepoSummary[];
  languages: LanguageShare[];
}
