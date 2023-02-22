import { useEffect, useState } from 'react'

/**
 * To use this animation is important that the class
 * contains  'transition-all duration-1000' and one
 * curve bezier in the style
 */
export const useAnimationOpen = () => {
  const [animation, setanimation] = useState('max-h-0 opacity-0')
  useEffect(() => {
    setanimation('max-h-[2000px] opacity-100')

    return () => {
      setanimation('max-h-0 opacity-0')
    }
  }, [])

  return {
    animation
  }
}
