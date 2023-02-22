import { QuoteCarData } from '../../redux/features/quoteSlice'
import { ContentfulTemplateQuotation, Sites } from '../../types'

export interface QuotationCardProps extends Sites {
  car: QuoteCarData | null
  client: {
    name: string
    lastName: string
    rut: string
    email: string
    phone: string
    branch: string
    comment?: string
  } | null
}

export interface QuoteDataItemProps extends Sites {
  name: string
  value: string
  isHighlighted?: boolean
  isMultiline?: boolean
}

export interface TmQuotationProps extends Sites {
  template: ContentfulTemplateQuotation
}
