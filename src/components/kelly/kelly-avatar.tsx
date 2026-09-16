import { cn } from "@/lib/utils";

export type KellyMood =
  | "idle"
  | "thinking"
  | "happy"
  | "concerned"
  | "waving"
  | "celebrating";

type KellyAvatarProps = {
  mood?: KellyMood;
  size?: "sm" | "md" | "lg" | number;
  theme?: string;
  label?: string;
  className?: string;
};

export function KellyAvatar({
  mood = "idle",
  size = "md",
  theme,
  label,
  className,
}: KellyAvatarProps) {
  const numericSize = typeof size === "number" ? size : undefined;
  const sizeClass =
    typeof size === "number" ? "kelly-character-md" : `kelly-character-${size}`;

  return (
    <div
      className={cn(
        "kelly-character",
        sizeClass,
        `kelly-character-${mood}`,
        theme ? `kelly-character-theme-${theme}` : undefined,
        className
      )}
      style={
        numericSize
          ? { width: numericSize, height: numericSize }
          : undefined
      }
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

        {(mood === "thinking") && (
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

        {(mood === "happy" || mood === "celebrating" || mood === "waving") && (
          <div className="kelly-character-sparkles" aria-hidden="true">
            <span className="kelly-sparkle-star" />
            <span className="kelly-sparkle-dot" />
          </div>
        )}
      </div>

      <div className="kelly-character-shadow" />
    </div>
  );
}
