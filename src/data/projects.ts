import type { CommitWeek, ProjectEntry } from './types'

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'agentflow-studio',
    name: 'AgentFlow-Studio',
    tagline: 'Visual LangGraph agent designer',
    description:
      'Drag-and-drop multi-agent flow editor that simulates agent graphs in real time and exports directly to LangGraph Python — built with React and Zustand.',
    stack: ['TypeScript', 'React', 'Zustand', 'LangGraph'],
    repoUrl: 'https://github.com/NaviAndrei/AgentFlow-Studio',
    status: 'online',
  },
  {
    id: 'django-chatbot',
    name: 'Django_Chatbot',
    tagline: 'AI medical chatbot backend',
    description:
      'Django backend for an AI-powered medical chatbot — conversation state machine, guest session persistence, and secure file validation, built during the ICI Bucharest AI Backend internship.',
    stack: ['Python', 'Django', 'IBM watsonx.ai'],
    repoUrl: 'https://github.com/NaviAndrei/Django_Chatbot',
    status: 'online',
  },
  {
    id: 'prompt-library',
    name: 'PromptLibrary',
    tagline: 'Zero-backend LLM prompt manager',
    description:
      'A production-quality web app for managing a collection of LLM prompts, with full CRUD and zero backend dependencies — built with React, TypeScript and Vite.',
    stack: ['React', 'TypeScript', 'Vite'],
    repoUrl: 'https://github.com/NaviAndrei/PromptLibrary',
    liveUrl: 'https://naviandrei.github.io/PromptLibrary/',
    status: 'online',
  },
  {
    id: 'cli-username',
    name: 'cli-username',
    tagline: 'Identity-generator CLI tool',
    description:
      'Python CLI for generating unique online identities — themed strategies, leet-speak conversion, and dynamic modifiers, built on SOLID principles with a fully JSON-configurable, modular architecture.',
    stack: ['Python'],
    repoUrl: 'https://github.com/NaviAndrei/cli-username',
    status: 'online',
  },
  {
    id: 'the-machine',
    name: 'the-machine',
    tagline: 'This portfolio — a computer you walk through',
    description:
      'BIOS boot sequence into a navigable 3D machine. React Three Fiber world with a full 2D fallback for accessibility and low-end devices. You are inside it right now.',
    stack: ['React', 'TypeScript', 'Three.js', 'Tailwind'],
    repoUrl: 'https://github.com/NaviAndrei',
    status: 'online',
  },
]

/** deterministic pseudo-random in [0,1) so the tower is identical every visit */
const pseudo = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// [PLACEHOLDER] mock GitHub commit activity, 52 weeks — swap with real API data later.
export const COMMIT_WEEKS: CommitWeek[] = Array.from({ length: 52 }, (_, week) => {
  const seasonal = Math.sin((week / 52) * Math.PI * 2 - 1.1) * 0.5 + 0.5
  const burst = pseudo(week * 3.7) > 0.82 ? 5 : 0
  const ramp = week > 38 ? (week - 38) * 0.25 : 0
  const commits = Math.max(0, Math.round(1 + seasonal * 5 + pseudo(week) * 5 + burst + ramp))
  return { week, commits }
})

export const MAX_WEEK_COMMITS = Math.max(...COMMIT_WEEKS.map((w) => w.commits))
