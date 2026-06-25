import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";

const ComingSoonCard = () => {
  return (
    <div className="glass-card flex flex-col gap-2 p-2 w-full opacity-60">
      <div className="rounded-lg overflow-hidden w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-xl font-mono text-muted-foreground uppercase tracking-widest">
          Coming Soon
        </span>
      </div>

      <div className="px-2 mt-4">
        <div className="text-xl font-light tracking-tight">Project Unknown</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          Something awesome is currently being built. Exploring new ideas and technologies. Stay tuned for updates.
        </p>
      </div>

      <div className="flex items-center gap-4 px-2 mt-4 h-5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Tech</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Stack</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Hidden</span>
      </div>

      <div className="w-full h-px bg-white/10 mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2">
        <div className="flex items-center gap-3">
          <BiLink className="w-4 h-4 text-muted-foreground/50 cursor-not-allowed" />
          <LuGithub className="w-4 h-4 text-muted-foreground/50 cursor-not-allowed" />
        </div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Later →
        </p>
      </div>
    </div>
  );
};

export default ComingSoonCard;
