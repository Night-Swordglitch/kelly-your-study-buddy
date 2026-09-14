import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUp, BookOpen, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { AppShell } from "@/components/kelly/app-shell";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadWorkspace, type ChatMessage } from "@/lib/kelly-data";
import { askKelly } from "@/lib/kelly-ai.functions";

export const Route = createFileRoute("/_authenticated/study")({
  ssr: false,
  component: StudyPage,
});

function StudyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [taskId, setTaskId] = useState<string | undefined>();
  const [taskTitle, setTaskTitle] = useState("Your study session");
  const [subject, setSubject] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const workspace = await loadWorkspace();

        const task = workspace.tasks[0];

        setMessages(
          workspace.messages.filter(
            (item) => !task || item.task_id === task.id,
          ),
        );

        if (task) {
          setTaskId(task.id);
          setTaskTitle(task.title);
          setSubject(task.subject);
          setProgress(task.progress);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your study session.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || sending) return;

    setError("");
    setSending(true);
    setMessage("");

    const optimisticUserMessage: ChatMessage = {
      id: `local-user-${Date.now()}`,
      user_id: "",
      task_id: taskId ?? null,
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticUserMessage]);

    try {
      const history = messages.slice(-12).map((item) => ({
        role: item.role,
        content: item.content,
      }));

      const result = await askKelly({
        data: {
          message: trimmed,
          taskId,
          history,
        },
      });

      const assistantMessage: ChatMessage = {
        id: `local-assistant-${Date.now()}`,
        user_id: "",
        task_id: taskId ?? null,
        role: "assistant",
        content: result.content,
        created_at: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kelly couldn't respond right now.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell mood="idle">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm shadow-sm">
            <BookOpen className="size-4" />
            Study session
          </div>
        </div>

        <section className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_16px_40px_-30px_rgba(10,10,10,.25)] sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#858585]">
                {subject || "Study"}
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0a0a0a]">
                {taskTitle}
              </h1>
            </div>

            <div className="min-w-[180px]">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#858585]">Progress</span>
                <span className="font-semibold text-[#0a0a0a]">
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#eaf0ff]">
                <div
                  className="h-full rounded-full bg-[#2f6bff] transition-all"
                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_16px_40px_-30px_rgba(10,10,10,.25)]">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
            {loading ? (
              <div className="flex min-h-[350px] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-[#2f6bff]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
                <KellyAvatar mood="happy" size="lg" />

                <h2 className="mt-5 text-xl font-semibold">
                  Ready when you are.
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#858585]">
                  Tell Kelly what you're working on, what feels difficult, or
                  where you'd like to start.
                </p>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.role === "assistant" && (
                    <div className="mt-1 shrink-0">
                      <KellyAvatar mood="idle" size="sm" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      item.role === "user"
                        ? "rounded-br-md bg-[#0a0a0a] text-white"
                        : "rounded-bl-md bg-[#f2ede5] text-[#151515]"
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex items-center gap-3">
                <KellyAvatar mood="idle" size="sm" />

                <div className="rounded-2xl rounded-bl-md bg-[#f2ede5] px-4 py-3">
                  <Loader2 className="size-4 animate-spin text-[#545454]" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="border-t border-black/10 bg-[#fdebf1] px-5 py-3 text-sm text-[#8d3154]">
              {error}
            </div>
          )}

          <form
            onSubmit={sendMessage}
            className="border-t border-black/10 p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#f9f8f6] p-2 shadow-inner">
              <Input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask Kelly anything about your study..."
                disabled={sending || loading}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || sending || loading}
                className="shrink-0 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2459dc]"
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}