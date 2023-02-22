import { Sites } from '../../types'
import { ContentfulTemplateTechnicalServiceSuccess } from '../../types/contentful/content-model/tm-technical-service-success'

export interface TmTechnicalServiceSuccessProps extends Sites {
  template: ContentfulTemplateTechnicalServiceSuccess
}
