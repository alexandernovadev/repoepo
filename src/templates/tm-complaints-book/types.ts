import { ContentfulTemplateComplaintsBook } from '../../types/contentful/content-model/tm-complaints-book'
import { Sites } from '../../types'
import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'

export interface TmComplaintsBookProps extends Sites {
  template?: ContentfulTemplateComplaintsBook
}

export type ComplaintsBookStepsProps = Pick<TmComplaintsBookProps, 'site' | 'template'>

export interface ContractedGoodsProps extends Sites {

}

export interface ComplaintsProps extends Sites {
  consumerTerms: MlRichTextProps['text']
}

export interface PersonalFormProps extends Sites {

}