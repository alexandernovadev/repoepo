import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'

export type ContentfulOrCollapsible = {
  title: string
  isBoldTitle?: boolean
  content: MlRichTextProps['text']
}
