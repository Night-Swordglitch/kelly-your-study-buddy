import { cn } from "@/lib/utils";

export type KellyMood = "idle" | "thinking" | "happy" | "concerned";

type KellyAvatarProps = {
  mood?: KellyMood;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export function KellyAvatar({
  mood = "idle",
  size = "md",
  label,
  className,
}: KellyAvatarProps) {
  return (
    <div
      className={cn(
        "kelly-character",
        `kelly-character-${size}`,
        `kelly-character-${mood}`,
        className
      )}
      role="img"
      aria-label={label ?? `Kelly is ${mood}`}
    >
      <div className="kelly-character-aura" />

      <div className="kelly-character-antenna">
        <span />
      </div>

      <div className="kelly-character-body">
        <span className="kelly-character-ear kelly-character-ear-left" />
        <span className="kelly-character-ear kelly-character-ear-right" />

        <span className="kelly-character-eye kelly-character-eye-left" />
        <span className="kelly-character-eye kelly-character-eye-right" />

        <span className="kelly-character-cheek kelly-character-cheek-left" />
        <span className="kelly-character-cheek kelly-character-cheek-right" />

        <span className="kelly-character-mouth" />

        {mood === "thinking" && (
          <div className="kelly-character-thoughts" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}

        {mood === "concerned" && (
          <div className="kelly-character-alert" aria-hidden="true">
            !
          </div>
        )}

        {mood === "happy" && (
          <div className="kelly-character-sparkles" aria-hidden="true">
            <span>?</span>
            <span>·</span>
          </div>
        )}
      </div>

      <div className="kelly-character-shadow" />
    </div>
  );
}
