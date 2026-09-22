import { useState } from "react";
import { RepoRow } from "./GithubRepos";
import { github } from "@/lib/githubData";
import { cn } from "@/lib/utils";

// Every public repo, with chips to narrow the list by main language.
// Hidden when the build could not reach GitHub.
const RepoIndex = ({ className }: { className?: string }) => {
  const [language, setLanguage] = useState<string | null>(null);
  const repos = github.all ?? [];
  if (repos.length === 0) return null;

  // Languages by how many repos use them, most first.
  const counts = new Map<string, number>();
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const languages = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const shown = language ? repos.filter((r) => r.language === language) : repos;

  const chip = (label: string, count: number, value: string | null) => {
    const active = language === value;
    return (
      <button
        key={label}
        type="button"
        onClick={() => setLanguage(value)}
        aria-pressed={active}
        className={cn(
          "flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] transition-colors",
          active ? "border-foreground bg-foreground text-background" : "border-border hover:bg-card",
        )}
      >
        {label}
        <span className={cn("tabular-nums", active ? "text-background/70" : "text-muted-foreground")}>{count}</span>
      </button>
    );
  };

  return (
    <section aria-labelledby="repo-index-title" className={cn("grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10", className)}>
      <div className="md:col-span-3">
        <h2 id="repo-index-title" className="text-[15px]">
          More on GitHub
        </h2>
        <p className="mt-2 max-w-[28ch] text-[15px] text-muted-foreground">
          Smaller builds, class projects, and experiments.
        </p>
      </div>
      <div className="md:col-span-9">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter repos by language">
          {chip("All", repos.length, null)}
          {languages.map(([name, count]) => chip(name, count, name))}
        </div>
        <ul className="mt-6 border-b border-border">
          {shown.map((repo) => (
            <RepoRow key={repo.name} repo={repo} />
          ))}
        </ul>
        <a
          href="https://github.com/jr-cho?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider underline-offset-4 hover:underline"
        >
          All repos on GitHub
        </a>
      </div>
    </section>
  );
};

export default RepoIndex;
