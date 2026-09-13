# Kelly: Your Student Companion

Lovable Build Prompt — Kelly

Paste this into Lovable to kick off the build. Feel free to trim/adjust wording, but keep the structure — it gives Lovable clear screen boundaries instead of one vague ask.

Prompt:

Build a website called "Kelly" — a personal AI assistant for students. Kelly helps students get their work done by guiding them through tasks step-by-step (not just giving answers like a typical chatbot), remembers context about the student over time, and sends timely reminders for deadlines.

The site should feel warm, calm, and encouraging — not corporate or clinical. Kelly should feel like a companion, not a tool.

Core visual element: Kelly has a small cute creature-style avatar (an invented character, not a real/branded animal) that appears throughout the site:

In its default state, it's a small companion icon docked in a corner of the screen (roughly 60–80px), with a subtle idle animation (breathing/blinking).

When the user opens the main chat/guided-work screen, the avatar expands to become a larger visual anchor for that screen.

The avatar should support a few expression states: neutral/idle, thinking/listening, happy/encouraging, and gentle concern (used when a deadline is approaching).

(For now, use a simple placeholder character shape/illustration — I'll swap in final artwork later. Build the interactive states/positioning logic around it.)

Pages/screens to build:

Landing Page

Hero section with the Kelly avatar, name, and a short tagline about guiding students through their work

3–4 short feature highlights: guides you through tasks, remembers your work, reminds you on time

"Try Kelly" / sign-up call-to-action button

Calm, friendly color palette

Sign Up / Login

Email + password sign-up and login

Minimal additional fields: name, and optionally course/major

Home / Dashboard

Small companion avatar visible

List of upcoming deadlines/reminders

Short greeting/status line (e.g. "You have 2 things due this week")

Button to enter the main Kelly interaction screen

Kelly Interaction Screen (core screen)

Expanded avatar, positioned prominently

Chat/conversation interface alongside or below the avatar

A small label showing what task/subject is currently being worked on

Avatar should visually react (change expression state) based on conversation context

Memory / Profile Screen

List of what Kelly currently "remembers" about the student (courses, ongoing tasks, past topics)

Ability to edit or delete individual stored memories

Settings

Notification/reminder preferences

Account details

Leave placeholder sections for future mood-based theming and peer network features (don't build these yet)

Not in scope for this build: full mood-based UI theming, peer-to-peer network features, payment/subscription flows. Leave clean space in the design for these to be added later, but don't build the logic now.

Notes for you (not part of the prompt):

After Lovable generates the first pass, review the avatar's default placeholder — you'll likely want to replace it with real character artwork once you have it.

Lovable typically scaffolds a React + Supabase backend by default, which should be enough to handle accounts, deadline data, and reminders for this first version.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6de14f03-75fd-4736-ae7d-d3c4e8cc97f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
