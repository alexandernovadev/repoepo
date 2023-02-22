import { ContentfulCommonBlock } from './common-block'
import { ContentfulMlPricingCard } from './content-model'
import { BlockContentType } from './block-content-type'

export type ContentfulContainerBlock = (
  | ContentfulCommonBlock
  | ContentfulMlPricingCard
) & {
  CONTENTFUL_ID: string
  CONTENT_TYPE: BlockContentType
}
