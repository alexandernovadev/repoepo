import { useEffect, useState } from 'react'

/**
 * Set a countdown until a function is called
 * @param fn The function to call at timeout
 * @param lastInteraction Timestamp of last interaction, if this value changes, then the timer is reset
 * @param time Time in milliseconds before a timeout occurs, by default it counts down from 12 hours
 */
export const useReset = (
  fn: () => void,
  lastInteraction: number,
  time = 43200000
) => {
  const [timeoutId, setNewId] = useState<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Compare current time with last interaction and see if function needs to be called (rehydrate state)
    if (Date.now() - lastInteraction >= time) {
      fn()
      return
    }

    // If there's a value, then it has changed (undefined at start), restart countdown (active session)
    if (timeoutId) clearTimeout(timeoutId)

    // Set reset countdown for current (active) session
    setNewId(setTimeout(fn, time))

    return () => clearTimeout(timeoutId!)
  }, [lastInteraction])
}
