import { useEffect, useState } from 'react'
import { isMobileLike } from './detect-capability'

/** mobile-class device (coarse pointer + narrow viewport), re-checked on resize/rotate */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(isMobileLike)

  useEffect(() => {
    const update = () => setMobile(isMobileLike())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return mobile
}
