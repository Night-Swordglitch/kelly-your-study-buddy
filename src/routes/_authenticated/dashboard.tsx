import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarPlus, Check, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell, PageIntro } from "@/components/kelly/app-shell";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";
import { loadWorkspace, currentUser, type Deadline, type Memory, type Profile, type Task } from "@/lib/kelly-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Kelly" }, { name: "description", content: "See upcoming deadlines and continue guided study sessions with Kelly." }, { property: "og:title", content: "Dashboard — Kelly" }, { property: "og:description", content: "Your calm study dashboard for deadlines, memories, and guided work." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<{ profile: Profile; deadlines: Deadline[]; memories: Memory[]; tasks: Task[] } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const refresh = () => loadWorkspace().then(setData).catch(console.error);
  useEffect(() => { refresh(); }, []);
  async function addDeadline(form: FormData) { const user = await currentUser(); const due = String(form.get("due")); await supabase.from("deadlines").insert({ user_id: user.id, title: String(form.get("title")), subject: String(form.get("subject") || "General"), due_at: new Date(due).toISOString() }); setShowAdd(false); refresh(); }
  async function toggle(item: Deadline) { await supabase.from("deadlines").update({ completed: !item.completed }).eq("id", item.id); refresh(); }
  const upcoming = data?.deadlines.filter((d) => !d.completed) ?? [];
  const urgent = upcoming.some((d) => new Date(d.due_at).getTime() - Date.now() < 86400000);
  return <AppShell mood={urgent ? "concerned" : "idle"}>
    <PageIntro eyebrow="Your day" title={data ? `Hi ${data.profile.display_name} — let’s make today count.` : "A calm plan is loading…"} description={upcoming.length ? `You have ${upcoming.length} thing${upcoming.length === 1 ? "" : "s"} coming up. Kelly will help you take them one step at a time.` : "Your desk is clear. Add a deadline or start a guided session when you're ready."} action={<Button asChild size="lg"><Link to="/work">Start a study session <ArrowRight /></Link></Button>} />
    <div className="mt-5 grid gap-5 lg:grid-cols-12">
      <section className="glass-panel rounded-3xl p-6 lg:col-span-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Current thread</p><h2 className="mt-1 font-display text-2xl font-semibold">{data?.tasks[0]?.title ?? "Choose your first study goal"}</h2></div><KellyAvatar mood="happy" size="sm" /></div><p className="mt-4 text-sm text-muted-foreground">{data?.tasks[0]?.current_step ?? "Tell Kelly what you need to finish."}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-soft"><div className="h-full rounded-full bg-prism" style={{ width: `${data?.tasks[0]?.progress ?? 10}%` }} /></div><div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span>{data?.tasks[0]?.subject ?? "Getting started"}</span><span>{data?.tasks[0]?.progress ?? 10}%</span></div></section>
      <section className="glass-panel prism-line rounded-3xl p-6 lg:col-span-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Upcoming</h2><Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}><CalendarPlus /> Add</Button></div>{showAdd && <form action={addDeadline} className="mt-4 grid gap-2"><Input name="title" placeholder="Assignment or exam" required /><Input name="subject" placeholder="Subject" /><Input name="due" type="datetime-local" required /><Button type="submit">Save deadline</Button></form>}<div className="mt-4 space-y-3">{upcoming.slice(0,4).map((d) => <button key={d.id} onClick={() => toggle(d)} className="flex w-full items-center gap-3 rounded-2xl bg-surface-soft p-3 text-left transition hover:bg-surface"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Clock3 className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{d.title}</span><span className="text-xs text-muted-foreground">{d.subject} · {new Date(d.due_at).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}</span></span><Check className="size-4 text-muted-foreground" /></button>)}{!upcoming.length && <p className="py-8 text-center text-sm text-muted-foreground">No upcoming deadlines yet.</p>}</div></section>
    </div>
    <section className="mt-5 grid gap-5 md:grid-cols-3">{["Guides each step", "Remembers your context", "Nudges you on time"].map((t,i) => <div className="glass-panel rounded-2xl p-5" key={t}><span className="text-xs font-semibold text-primary">0{i+1}</span><h3 className="mt-2 font-display text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{i===0?"Kelly asks the next useful question instead of taking over.":i===1?`${data?.memories.length ?? 0} details currently help shape your sessions.`:"Your nearest deadlines stay visible without feeling alarming."}</p></div>)}</section>
  </AppShell>;
}
