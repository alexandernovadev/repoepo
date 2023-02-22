import { ContentfulAtLink } from '.'
import { ContentfulAsset } from '..'

export interface ContentfulMlPromotionsCard {
  title: string
  description: string
  image: ContentfulAsset
  imageDescription?: string
  button?: any
  link?: ContentfulAtLink
  className?: string
}
