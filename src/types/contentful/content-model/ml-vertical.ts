import { ContentfulAsset } from '@gac/core-components/lib/@types/common'
import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'

export enum MlVerticalVariants {
  INFO_CARD = 'info-card'
}
export interface ContentfulMlVertical {
  className?: string
  variant: MlVerticalVariants
  image?: ContentfulAsset
  imageAlt?: string
  text: MlRichTextProps['text']
}
