import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Car } from '../types/contentful/car'

const parseQuiterUrl = (path: string) => {
  const params = path.split('&')
  const getFirstParam = path.split('?', 2)

  const parsedParams = [getFirstParam[1]?.split('&')[0], ...params].filter((item) => {
    if (/tipo|categoria|modelo|marca|quiterId|vehicle/.test(item)) {
      return false
    }

    return true
  })

  return parsedParams.length > 0 ? parsedParams.join('&') : ''
}

const useSetPdpUrl = (queryParams: string, car: Car) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const route = router.asPath.split('?')
  
  const params = useMemo(() => {
    if (route[1] && route[1].includes('quiterId') || route[0].includes('quiterId')) {
      const extraParams = parseQuiterUrl(router.asPath)
      return `${queryParams}&${extraParams}`
    }

    if (route[1] && route[1].includes(queryParams)) {
      return route[1]
    }

    return queryParams
  }, [queryParams])

  const toggleModal = () => {
    if (!isModalOpen) {
      openModal()
    } else {
      closeModal()
    }
  }

  const openModal = () => {
    router.replace(`${route[0]}?${params}&form`, undefined, {
      shallow: true
    })
  }

  const closeModal = () => {
    router.replace(`${route[0]}?${params}`.replace(/&form$/, ''), undefined, {
      shallow: true
    })
  }

  useEffect(() => {
    if (!router.asPath.includes(`/vehicle/${car.id}`)) {
      router.replace(`/vehicle/${car.id}?${params}`, undefined, {
        shallow: true
      })
    } else if (!router.asPath.includes(queryParams)) {
      router.replace(`${route[0]}?${params}`, undefined, {
        shallow: true
      })
    } else if (router.asPath.includes('form')) {
      document.body.style.overflow = 'hidden'
      setIsModalOpen(true)
    } else {
      document.body.style.overflow = 'auto'
      setIsModalOpen(false)
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [router.asPath])

  return {
    isModalOpen,
    toggleModal
  }
}

export default useSetPdpUrl
