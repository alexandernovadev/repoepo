import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { BlockContentType } from '../block-content-type'
import { ContentfulElement } from '../element'

export type RichText = MlRichTextProps['text']

export type ContentfulMlRichText = {
  text: MlRichTextProps['text']
  options: any
  variant: MlRichTextVariant
} & ContentfulElement<BlockContentType.MlRichText>

export enum MlRichTextVariant {
  DEFAULT = 'default',
  FOOTER = 'footer',
  ML_VERTICAL = 'ml-vertical',
  NEWS = 'news'
}
