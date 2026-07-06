export interface BootLine {
  text: string
  /** ms after the previous line appears */
  delay: number
  className?: string
  /** this line renders the animated memory count-up */
  memoryCount?: boolean
}

export const MEMORY_TOTAL = 65536
export const MEMORY_COUNT_MS = 850

export const BOOT_LINES: BootLine[] = [
  { text: 'MACHINE BIOS v2.6.1 — IA SYSTEMS', delay: 120, className: 'text-ink' },
  { text: 'Copyright (C) 2026, Ivan Andrei. All interrupts reserved.', delay: 70, className: 'text-dim' },
  { text: '', delay: 60 },
  { text: 'Main Processor : HUMAN-1208 @ 3.30GHz [support-hardened]', delay: 220 },
  { text: '', delay: 40, memoryCount: true },
  { text: '', delay: 260 },
  { text: 'Init chipset ..................... DONE', delay: 90 },
  { text: 'USB Device(s) .................... 1 Keyboard, 1 Mouse, 1 Visitor', delay: 170 },
  { text: 'Detecting internal volumes ......', delay: 240 },
  { text: '  /dev/sda1   ABOUT.SYS          4 MB   [OK]', delay: 140, className: 'text-dim' },
  { text: '  /dev/sda2   SKILLS.PROC       12 MB   [OK]', delay: 90, className: 'text-dim' },
  { text: '  /dev/sda3   PROJECTS.DAT     128 MB   [OK]', delay: 130, className: 'text-dim' },
  { text: '  /dev/sda4   CONTACT.IO         1 MB   [OK]', delay: 80, className: 'text-dim' },
  { text: 'Mounting filesystem .............. [OK]', delay: 300 },
  { text: 'Loading render pipeline .......... [OK]', delay: 340 },
  { text: 'Starting spatial interface ....... [OK]', delay: 260 },
  { text: '', delay: 120 },
  { text: 'Boot device: THE MACHINE', delay: 220, className: 'text-neon' },
  { text: 'Entering system ...', delay: 380 },
]
