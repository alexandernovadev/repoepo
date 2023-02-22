import { ContentfulAtButton } from '.'
import { ContentfulTemplateType } from '..'

export interface ContentfulTemplateError {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmError
  description: string
  name: string
  title: string
  warning: string
  errorImage: {
    file: {
      url: string
    }
    title: string
    description: string
  }
  button: ContentfulAtButton
}
