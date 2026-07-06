import { create } from 'zustand'
import {
  detectMode,
  lowSpecDevice,
  prefersReducedMotion,
  storeModePreference,
  type Mode,
} from '../lib/detect-capability'

export type { Mode }
export type BootPhase = 'post' | 'wipe' | 'done'
export type RoomId = 'bus' | 'about' | 'projects' | 'skills' | 'contact'
export type Quality = 'high' | 'low'

interface MachineState {
  mode: Mode
  bootPhase: BootPhase
  currentRoom: RoomId
  selectedProject: string | null
  travelTarget: RoomId | null
  glitching: boolean
  quality: Quality
  reducedMotion: boolean
  setMode: (mode: Mode) => void
  startWipe: () => void
  finishBoot: () => void
  setRoom: (room: RoomId) => void
  selectProject: (id: string | null) => void
  requestTravel: (room: RoomId) => void
  clearTravel: () => void
  triggerGlitch: () => void
  setQuality: (quality: Quality) => void
}

let glitchTimer: ReturnType<typeof setTimeout> | undefined

export const useMachine = create<MachineState>()((set, get) => ({
  mode: detectMode(),
  bootPhase: 'post',
  currentRoom: 'bus',
  selectedProject: null,
  travelTarget: null,
  glitching: false,
  quality: lowSpecDevice() ? 'low' : 'high',
  reducedMotion: prefersReducedMotion(),

  setMode: (mode) => {
    storeModePreference(mode)
    if (mode === '3d') {
      // re-entering 3D replays the boot sequence from the front bus
      set({ mode, bootPhase: 'post', currentRoom: 'bus', selectedProject: null, travelTarget: null })
    } else {
      set({ mode, selectedProject: null, travelTarget: null })
    }
  },
  startWipe: () => set({ bootPhase: 'wipe' }),
  finishBoot: () => set({ bootPhase: 'done' }),
  setRoom: (room) => set({ currentRoom: room }),
  selectProject: (id) => set({ selectedProject: id }),
  requestTravel: (room) => set({ travelTarget: room }),
  clearTravel: () => set({ travelTarget: null }),
  triggerGlitch: () => {
    if (get().reducedMotion) return
    clearTimeout(glitchTimer)
    set({ glitching: true })
    glitchTimer = setTimeout(() => set({ glitching: false }), 380)
  },
  setQuality: (quality) => set({ quality }),
}))

/**
 * Player transform, written by the 3D loop every frame and read by the
 * minimap on its own rAF. Kept outside zustand on purpose — updating React
 * state at 60fps would re-render the world.
 */
export const playerState = { x: 0, z: 3, yaw: 0 }
