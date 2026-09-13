import { cn } from "@/lib/utils";

type KellyMood = "idle" | "thinking" | "happy" | "concerned";

export function KellyAvatar({ mood = "idle", size = "md", label }: { mood?: KellyMood; size?: "sm" | "md" | "lg"; label?: string }) {
  return (
    <div className={cn("kelly-wrap", `kelly-${mood}`, size === "sm" && "kelly-sm", size === "lg" && "kelly-lg")} role="img" aria-label={label ?? `Kelly is ${mood}`}>
      <div className="kelly-antenna"><span /></div>
      <div className="kelly-body">
        <span className="kelly-ear kelly-ear-left" /><span className="kelly-ear kelly-ear-right" />
        <span className="kelly-eye kelly-eye-left" /><span className="kelly-eye kelly-eye-right" />
        <span className="kelly-cheek kelly-cheek-left" /><span className="kelly-cheek kelly-cheek-right" />
        <span className="kelly-mouth" />
        {mood === "thinking" && <span className="kelly-thought">•••</span>}
        {mood === "concerned" && <span className="kelly-alert">!</span>}
      </div>
    </div>
  );
}
