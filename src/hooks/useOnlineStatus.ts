import { useState, useEffect } from 'react'

const TIMEOUT_TIME_MS = 3000
const onlinePollingInterval = 100000

const timeout = (time: number, promise: any) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(new Error('Request timed out.'))
    }, time)
    promise.then(resolve, reject)
  })
}

// checkOnlineStatus: función a la que podemos llamar para verificar si se puede acceder a nuestro recurso en la red.
// Llamamos a esta checkOnlineStatusfunción cada 100000ms (100 segundos) para verificar si podemos obtener este recurso.
// Si la recuperación falla o tarda más de 3 segundos, abortamos la solicitud y actualizamos el valor en línea.
const checkOnlineStatus = async () => {
  const controller = new AbortController()
  const { signal } = controller

  // If the browser has no network connection return offline
  if (!navigator.onLine) return navigator.onLine

  //
  try {
    await timeout(
      TIMEOUT_TIME_MS,
      fetch('', {
        method: 'GET',
        signal
      })
    )
    return true
  } catch (error) {
    // Error Log
    // console.error(error)

    // This can be because of request timed out
    // so we abort the request for any case
    controller.abort()
  }
  return false
}

export const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true)

  const checkStatus = async () => {
    const online = await checkOnlineStatus()
    setOnlineStatus(online)
  }

  useEffect(() => {
    window.addEventListener('offline', () => {
      setOnlineStatus(false)
    }, {passive: true})

    // Add polling incase of slow connection
    const id = setInterval(() => {
      checkStatus()
    }, onlinePollingInterval)

    return () => {
      window.removeEventListener('offline', () => {
        setOnlineStatus(false)
      })

      clearInterval(id)
    }
  }, [])

  return {
    onlineStatus
  }
}
