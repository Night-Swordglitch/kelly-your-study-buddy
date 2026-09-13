import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; user_id: string; display_name: string; course_major: string | null };
export type Deadline = { id: string; user_id: string; title: string; subject: string; due_at: string; estimated_minutes: number; completed: boolean };
export type Memory = { id: string; user_id: string; category: string; content: string };
export type Task = { id: string; user_id: string; title: string; subject: string; current_step: string; progress: number };
export type Preference = { id: string; user_id: string; deadline_reminders: boolean; daily_summary: boolean; reminder_lead_hours: number; quiet_hours_start: string; quiet_hours_end: string };
export type ChatMessage = { id: string; user_id: string; task_id: string | null; role: "user" | "assistant"; content: string; created_at: string };

export async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Please sign in again.");
  return data.user;
}

export async function ensureWorkspace() {
  const user = await currentUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (!profile) {
    const displayName = String(user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student");
    await supabase.from("profiles").insert({ user_id: user.id, display_name: displayName, course_major: user.user_metadata?.course_major || null });
    await supabase.from("notification_preferences").insert({ user_id: user.id });
    await supabase.from("tasks").insert({ user_id: user.id, title: "Choose your first study goal", subject: "Getting started", current_step: "Tell Kelly what you need to finish", progress: 10 });
    await supabase.from("memories").insert({ user_id: user.id, category: "Study preference", content: "Guide me one small step at a time" });
  }
  return user;
}

export async function loadWorkspace() {
  const user = await ensureWorkspace();
  const [profiles, deadlines, memories, tasks, preferences, messages] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("deadlines").select("*").eq("user_id", user.id).order("due_at"),
    supabase.from("memories").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("tasks").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("conversation_messages").select("*").eq("user_id", user.id).order("created_at").limit(80),
  ]);
  const error = [profiles, deadlines, memories, tasks, preferences, messages].find((result) => result.error)?.error;
  if (error) throw error;
  return { user, profile: profiles.data as Profile, deadlines: (deadlines.data ?? []) as Deadline[], memories: (memories.data ?? []) as Memory[], tasks: (tasks.data ?? []) as Task[], preference: preferences.data as Preference | null, messages: (messages.data ?? []) as ChatMessage[] };
}
