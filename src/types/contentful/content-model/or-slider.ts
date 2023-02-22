import { ReactNode } from 'react'
import { ContentfulAsset } from '../common'
export interface ContentfulOrSlider {
  type: SliderTypeClasses
  children: ReactNode[]
  items: any
  disableLoop: boolean
  imageItems: Array<ContentfulAsset>
}

export enum SliderTypeClasses {
  PROMOTIONS = 'promotions',
  MOREVIEWS = 'moreViews',
  VERSIONS = 'versions',
  PERKS = 'perks'
}
