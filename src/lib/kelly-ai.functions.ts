import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({ message: z.string().min(1).max(4000), task: z.string().max(300).optional(), history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(12) });

export const askKelly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env['LOVABLE_API_KEY']!}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        messages: [
          { role: "system", content: `You are Kelly, a warm student study companion. Guide the student step-by-step instead of simply giving answers. Ask one useful question at a time, keep responses under 120 words, celebrate effort without being sugary, and gently surface deadlines. Current task: ${data.task || "not selected"}.` },
          ...data.history,
          { role: "user", content: data.message },
        ],
      }),
    });
    if (!response.ok) throw new Error("Kelly needs a moment. Please try again.");
    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return { content: result.choices?.[0]?.message?.content ?? "Let's take one small step. What part feels most unclear?" };
  });
