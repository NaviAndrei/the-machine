import type { Profile } from './types'

export const PROFILE: Profile = {
  name: 'Ivan Andrei',
  role: 'App Support Engineer → AI Quality Engineering / DevOps',
  headline:
    'I keep production systems alive for a living — and I am building my way from the support desk into AI quality engineering and agent architecture.',
  bio: [
    'Application Support Engineer with 7+ years across IT operations, L1/L2 support, and application reliability in telecom and retail. Hands-on with Linux/Windows administration, SQL Server/MySQL, monitoring (Grafana, Graylog), and full incident/change/problem management with root-cause analysis.',
    'Currently an AI Quality Engineer & Integration Specialist at Matrix42, stress-testing the Cortex AI platform and its Copilot/Azure DevOps/Teams integrations — while studying Computer Science and building LangGraph agents and Django AI backends on the side.',
  ],
  narrative: [
    {
      title: 'SUPPORT',
      body: '7+ years of frontline incident response at Vodafone, Stefanini and Huawei — IoT hypercare, ExtendaRetail POS, telecom back-office. Log forensics, RCA, and 120+ tickets resolved in a single engagement. Support teaches you how systems actually fail — not how the docs say they do.',
    },
    {
      title: 'OPS',
      body: 'Technical Support Engineer, Infrastructure & Cloud at Matrix42: SQL Server, Active Directory and Azure diagnosis for enterprise ESM customers, plus a Django AI-chatbot backend built during an ICI Bucharest internship.',
    },
    {
      title: 'BUILD',
      body: 'AI Quality Engineer & Integration Specialist at Matrix42 Innovation Studio — systematic bug discovery on LLM outputs, architectural direction for agent workflows, and guardrails for the Copilot↔Cortex integration. Earned a "Make it Happen" bonus for it.',
    },
  ],
  timeline: [
    {
      period: 'MAR 2026 — NOW',
      title: 'AI Quality Engineer & Integration Specialist',
      org: 'Matrix42 — Innovation Studio',
      details:
        'Cortex AI platform validation, agent/workflow architecture direction, Copilot ↔ Azure DevOps ↔ Teams integration guardrails.',
    },
    {
      period: 'OCT 2025 — NOW',
      title: 'Technical Support Engineer, Infrastructure & Cloud',
      org: 'Matrix42',
      details: 'SQL Server, Active Directory and Azure diagnosis via root-cause analysis for enterprise ESM customers.',
    },
    {
      period: 'NOV 2025 — FEB 2026',
      title: 'AI Backend Intern',
      org: 'ICI Bucharest',
      details: 'Django backend for an AI medical chatbot; IBM watsonx.ai foundation models and multi-agent BeeAI setup.',
    },
    {
      period: '2018 — 2024',
      title: 'Application & IT Support Engineer',
      org: 'Vodafone → Stefanini → Huawei',
      details: '7+ years of L1/L2 support — IoT hypercare, ExtendaRetail POS, telecom back-office, 120+ incidents resolved.',
    },
  ],
}
