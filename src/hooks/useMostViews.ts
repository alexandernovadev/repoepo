import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { commonSelector } from '../redux/features/commonSlice'
import { SitesNames } from '../types'
import { fetchWithoutToken } from '../utils/fetch'
import { parseResponse } from '../utils/formatMostViewsData'

const endpoint = 'catalog/api/car/most-visit'

const getMostViewsParams = (type: string) => {
  switch (type) {
    case 'moreViewsUsed':
      return '&type=USADO'

    case 'moreViewsNews':
      return '&type=NUEVO'

    default:
      return ''
  }
}

const useMostViews = (site: SitesNames, type: string) => {
  const isCancelled = useRef(false)
  const [mostViews, setMostViews] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const mostViewTypeParam = getMostViewsParams(type)
  const { carPlaceholderImg, oldCarPlaceholderImage, tags } =
    useSelector(commonSelector)

  const fetchMoreViews = async () => {
    try {
      isCancelled.current = false
      const response = await fetchWithoutToken(
        `${endpoint}?limit=3${mostViewTypeParam}`,
        site
      )

      if (response.result && !isCancelled.current && carPlaceholderImg) {
        setMostViews(() => {
          return [
            ...parseResponse(
              response.result,
              carPlaceholderImg!,
              oldCarPlaceholderImage!,
              site,
              tags
            )
          ]
        })
        setLoading(() => {
          return false
        })
      }
    } catch (error) {
      console.log(error)
      setError(() => {
        return true
      })
    }
  }

  useEffect(() => {
    fetchMoreViews()
    return () => {
      isCancelled.current = true
    }
  }, [])

  return {
    mostViews,
    loading,
    error
  }
}

export default useMostViews
