import { AtBrand, OrSlider } from '@gac/core-components'
import { mapBrand } from '../../../utils/mapSliderBrands'
import { SitesNames } from '../../../types'
import useScreenWidth from '../../../hooks/useScreenWidth'

interface BrandSliderProps {
  items: any
  type: any
  loop: boolean
  site: SitesNames
}

export const BrandSlider = ({ type, items, loop, site }: BrandSliderProps) => {
  const { screenWidth } = useScreenWidth()
  const showItemsScreenByLength = (size: number) => {
    switch (size) {
      case 9:
      case 8:
      case 7:
        return 1024
      case 6:
      case 5:
        return 420
      default:
        return 0
    }
  }

  return (
    <>
      {items.length <= 9 &&
      screenWidth > showItemsScreenByLength(items.length) ? (
        <div className='w-full flex items-center justify-center gap-x-2'>
          {items?.map((item: any, index: number) => (
            <AtBrand {...mapBrand(item)} key={index} />
          ))}
        </div>
      ) : (
        <OrSlider type={type} loop={loop} site={site}>
          {items?.map((item: any, index: number) => (
            <AtBrand {...mapBrand(item)} key={index} />
          ))}
        </OrSlider>
      )}
    </>
  )
}
