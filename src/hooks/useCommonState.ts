import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ContentfulPgPage } from '../types'
import {
  setBrands,
  setCarPlaceholderImage,
  setLogo,
  setOldCarPlaceholderImage,
  setSite,
  setTags,
  setColors
} from '../redux/features/commonSlice'

const useCommonState = (page: ContentfulPgPage, site: string) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (page) {
      dispatch(
        setCarPlaceholderImage({
          url: page?.global?.carPlaceholderImage?.file.url,
          alt: page?.global?.carPlaceholderImage?.title
        })
      )
      dispatch(
        setOldCarPlaceholderImage({
          url: page?.global?.oldCarPlaceholderImage?.file.url,
          alt: page?.global?.oldCarPlaceholderImage?.title
        })
      )
      dispatch(setBrands(page?.global?.brands))
      dispatch(setLogo(page?.global?.siteLogo))
      if (page?.global?.tags) {
        dispatch(setTags(page.global.tags))
      }
      if (page?.global?.colors) {
        dispatch(setColors(page.global.colors))
      }
    }
    dispatch(setSite(site))
  }, [page])
}

export default useCommonState
