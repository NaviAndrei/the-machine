import { Color } from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'

/**
 * Screen-like surface: scanlines, mains-hum flicker, edge vignette,
 * sparse pixel noise. Applied to every "display" inside the machine.
 */
export const CrtScreenMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color('#39ff9c'),
    uBg: new Color('#02100a'),
    uIntensity: 1,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBg;
    uniform float uIntensity;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      float scan = 0.72 + 0.28 * sin(uv.y * 220.0 + uTime * 6.0);
      float flicker = 0.94 + 0.06 * sin(uTime * 47.0) * sin(uTime * 13.7);
      float vig = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x)
                * smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);
      float grain = hash(floor(uv * vec2(240.0, 140.0)) + floor(uTime * 20.0)) * 0.10;

      vec3 col = mix(uBg, uColor, 0.16 + grain);
      col += uColor * scan * 0.12 * uIntensity;
      col *= flicker;
      col *= 0.30 + 0.70 * vig;

      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
)

extend({ CrtScreenMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    crtScreenMaterial: ThreeElement<typeof CrtScreenMaterial>
  }
}
