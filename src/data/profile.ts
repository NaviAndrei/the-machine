import type { Profile } from './types'

export const PROFILE: Profile = {
  name: 'Ivan Andrei',
  role: 'Technical Support Engineer → DevOps & AI Systems Engineer',
  headline:
    'I keep production systems alive for a living and I am building my way from the support desk into AI quality engineering and agent architecture.',
  bio: [
    'Application Support Engineer with 8+ years across IT operations, L1/L2 support, and application reliability in telecom and retail. Hands-on with Linux/Windows administration, SQL Server/MySQL, monitoring (Grafana, Graylog), and full incident/change/problem management with root-cause analysis.',
    'Currently a Technical Support Engineer at Matrix42 (ESM & M42 Intelligence+), with a side initiative stress-testing the Cortex AI platform and its Copilot/Azure DevOps/Teams integrations — while studying Computer Science and building LangGraph agents and Django AI backends on the side.',
  ],
  narrative: [
    {
      title: 'SUPPORT',
      body: '8+ years of frontline incident response at Vodafone, Stefanini and Huawei — IoT hypercare, ExtendaRetail POS, telecom back-office. Log forensics, RCA, and 120+ tickets resolved in a single engagement. Support teaches you how systems actually fail, not how the docs say they do.',
    },
    {
      title: 'OPS',
      body: 'Technical Support Engineer, Infrastructure & Cloud at Matrix42: SQL Server, Active Directory and Azure diagnosis for enterprise ESM customers, plus a Django AI-chatbot backend built during an ICI Bucharest internship.',
    },
    {
      title: 'BUILD',
      body: 'Cortex AI testing initiative at Matrix42 — systematic bug discovery on LLM outputs, architectural input on agent workflows, and guardrails for the Copilot↔Cortex integration. Earned a "Make it Happen" bonus for it.',
    },
  ],
  timeline: [
    {
      period: 'OCT 2025 — NOW',
      title: 'Technical Support Engineer – Infrastructure & Cloud',
      org: 'Matrix42',
      details: 'SQL Server, Active Directory and Azure diagnosis via root-cause analysis for enterprise ESM customers.',
      project: {
        tag: 'PROJECT',
        title: 'Cortex AI — QA & Integration Testing',
        body: 'Side initiative within the support role, since Mar 2026: deep-dive validation and bug discovery on LLM outputs, testing Microsoft Copilot / Azure DevOps / MS Teams integrations, architectural input on AI agent workflows, and guardrails for the Copilot↔Cortex integration. Earned a "Make it Happen" bonus for this testing initiative.',
      },
    },
    {
      period: 'NOV 2025 — FEB 2026',
      title: 'AI Backend Intern',
      org: 'ICI Bucharest',
      details: 'Django backend for an AI medical chatbot; IBM watsonx.ai foundation models and multi-agent BeeAI setup.',
    },
    {
      period: 'JUL 2025 — SEP 2025',
      title: 'Back Office Engineer',
      org: 'Huawei',
      details: '2nd line support for telecom back-office systems — incident/change/problem lifecycle, RCA, rotational on-call.',
    },
    {
      period: 'JAN 2025 — JUL 2025',
      title: 'Freelancer',
      org: 'Digitech Sync SRL',
      details: 'Web development and Python automation; advanced remote support for LG Energy Solution ESS, resolving 120+ tickets in two months.',
    },
    {
      period: '2018 — 2024',
      title: 'Application & IT Support Engineer',
      org: 'Vodafone → Stefanini',
      details: '8+ years of L1/L2 support — IoT hypercare, ExtendaRetail POS, telecom back-office.',
    },
  ],
}
