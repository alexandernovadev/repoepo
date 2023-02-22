import { ContentfulElement } from '../element'
import { ComponentContentType } from '../component-content-type'
import { ContentfulAsset } from '../common'
import { RichText } from './ml-rich-text'
import { ContentfulAtButton } from './at-button'

export type ContentfulMlPricingCard = {
  // color: MlPricingCardTypes
  featured: boolean
  title: string
  description: RichText
  price: string
  priceInfo?: string
  lowerImage?: ContentfulAsset
  lowerDescription?: RichText
  buttons?: ContentfulAtButton[]
} & ContentfulElement<ComponentContentType.ML_PRICING_CARD>
