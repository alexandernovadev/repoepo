import { MlHorizontalVariant } from '@gac/core-components'
import { ContentfulAsset } from '@gac/core-components/lib/@types/common'
import { ContentfulAtLink } from './at-link'

export interface ContentfulMlHorizontal {
  variant: MlHorizontalVariant
  title: string
  description?: string
  link?: ContentfulAtLink
  image?: ContentfulAsset
  titleClassName?: string
  descriptionClassName?: string
}
