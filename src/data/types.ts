interface SkillBase {
  id: string
  name: string
  /** cosmetic process id shown on the card */
  pid: number
  category: 'ops' | 'dev'
  blurb: string
}

/** paid/professional experience — shown as UPTIME (years) + proficiency % */
export interface VerifiedSkill extends SkillBase {
  tier: 'verified'
  /** 0–100 */
  proficiency: number
  /** years of experience, shown as "uptime" */
  years: number
}

/** lab/practice skill — no years claim, shown as a status badge instead */
export interface SelfDirectedSkill extends SkillBase {
  tier: 'self-directed'
  status: string
}

export type SkillEntry = VerifiedSkill | SelfDirectedSkill

export interface ProjectEntry {
  id: string
  name: string
  tagline: string
  description: string
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  status: 'online' | 'building' | 'archived'
}

export interface TimelineEntry {
  period: string
  title: string
  org: string
  details: string
  /** side initiative/project taken on within this role — rendered as a nested sub-note, not a separate job */
  project?: {
    tag: string
    title: string
    body: string
  }
}

export interface NarrativeBlock {
  title: string
  body: string
}

export interface Profile {
  name: string
  role: string
  headline: string
  bio: string[]
  narrative: NarrativeBlock[]
  timeline: TimelineEntry[]
}

export interface ContactLink {
  id: string
  label: string
  value: string
  href: string
  /** cosmetic protocol tag shown on the console, e.g. SMTP */
  protocol: string
}

export interface CommitWeek {
  week: number
  commits: number
}
