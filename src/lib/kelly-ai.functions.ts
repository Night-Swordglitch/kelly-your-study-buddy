import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  message: z.string().min(1).max(4000),
  taskId: z.string().uuid().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(12),
});

export const askKelly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const [profileResult, taskResult, memoriesResult, deadlinesResult] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, course_major")
          .eq("user_id", userId)
          .maybeSingle(),

        data.taskId
          ? supabase
              .from("tasks")
              .select("id, title, subject, current_step, progress")
              .eq("id", data.taskId)
              .eq("user_id", userId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),

        supabase
          .from("memories")
          .select("category, content")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),

        supabase
          .from("deadlines")
          .select("title, subject, due_at, completed")
          .eq("user_id", userId)
          .eq("completed", false)
          .order("due_at")
          .limit(10),
      ]);

    if (profileResult.error) throw profileResult.error;
    if (taskResult.error) throw taskResult.error;
    if (memoriesResult.error) throw memoriesResult.error;
    if (deadlinesResult.error) throw deadlinesResult.error;

    const profile = profileResult.data;
    const task = taskResult.data;
    const memories = memoriesResult.data ?? [];
    const deadlines = deadlinesResult.data ?? [];

    const contextSummary = `
Student:
- Name: ${profile?.display_name || "Student"}
- Course: ${profile?.course_major || "Not specified"}

Current study task:
- Title: ${task?.title || "No task selected"}
- Subject: ${task?.subject || "Not specified"}
- Current step: ${task?.current_step || "Not specified"}
- Progress: ${task?.progress ?? 0}%

Remembered preferences:
${
  memories.length
    ? memories.map((memory) => `- ${memory.category}: ${memory.content}`).join("\n")
    : "- None yet"
}

Upcoming deadlines:
${
  deadlines.length
    ? deadlines
        .map(
          (deadline) =>
            `- ${deadline.title} (${deadline.subject}) — due ${deadline.due_at}`,
        )
        .join("\n")
    : "- None"
}
`.trim();

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-lite",
          messages: [
            {
              role: "system",
              content: `You are Kelly, a warm and practical student study companion.

Your job is to help the student make progress, not simply dump answers.

Rules:
- Guide the student step-by-step.
- Ask at most one useful question at a time.
- Keep responses under 120 words.
- Explain difficult ideas clearly and simply.
- Celebrate genuine progress without being overly sugary.
- Use the student's current task when relevant.
- Remember their preferences when useful.
- Gently mention an upcoming deadline when it is relevant.
- Never pretend to know something that is not in the provided context.

Student workspace:
${contextSummary}`,
            },
            ...data.history,
            {
              role: "user",
              content: data.message,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Kelly needs a moment. Please try again.");
    }

    const result = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const content =
      result.choices?.[0]?.message?.content ??
      "Let's take one small step. What part feels most unclear?";

    await supabase.from("conversation_messages").insert([
      {
        user_id: userId,
        task_id: task?.id ?? null,
        role: "user",
        content: data.message,
      },
      {
        user_id: userId,
        task_id: task?.id ?? null,
        role: "assistant",
        content,
      },
    ]);

    return { content };
  });