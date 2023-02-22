import { ContentfulAtLink, ContentfulTemplateType, RichText } from '..'
import { Section } from './tm-terms-and-conditions'

export interface ContentfulTmCustomerService {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmCustomerService
  title: string
  description?: RichText
  sectionTitle?: ContentfulAtLink
  sections?: Section[]
  requestTypes: string[]
  serviceTypes: string[]
  contactReasons: string[]
  cities: string[]
}
