import { MlCardBasic, OrSlider } from '@gac/core-components'
import { event } from '../../utils/ga'
import { MostViews } from '../MostViews/index'
import { SitesNames } from '../../types'
import { BrandSlider } from './Variants/BrandSlider'

export const renderSlider = (
  type: any,
  items: any,
  loop: boolean,
  site: SitesNames
) => {
  switch (type) {
    case 'promotions':
      return (
        <OrSlider type={type} loop={loop} site={site}>
          {items?.map((item: any, index: number) => (
            <MlCardBasic
              site={site}
              key={index}
              title={item.title}
              description={item.description}
              image={item.image.file.url}
              imageDescription={item.image.title}
              button={item.button}
              link={item.link}
              analyticsHandler={event}
            />
          ))}
        </OrSlider>
      )

    case 'moreViews':
    case 'moreViewsNews':
    case 'moreViewsUsed':
      return (
        <MostViews type={'moreViews'} variant={type} loop={loop} site={site} />
      )

    case 'moreViewsSmall':
      return <MostViews type={type} variant={type} loop={loop} site={site} />

    case 'brands':
      return <BrandSlider type={type} loop={loop} site={site} items={items} />

    default:
      return null
  }
}
