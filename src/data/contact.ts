import type { ContactLink } from './types'

export const CONTACT_LINKS: ContactLink[] = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'andrei.ivan1208@gmail.com',
    href: 'mailto:andrei.ivan1208@gmail.com',
    protocol: 'SMTP',
  },
  {
    id: 'github',
    label: 'GITHUB',
    value: 'github.com/NaviAndrei',
    href: 'https://github.com/NaviAndrei',
    protocol: 'SSH',
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    value: 'linkedin.com/in/sync-with-ivan',
    href: 'https://www.linkedin.com/in/sync-with-ivan/',
    protocol: 'HTTPS',
  },
]
