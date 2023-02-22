import { Sites } from '../../types'
import { ContentfulTemplateTechnicalServiceMain } from '../../types/contentful/content-model/tm-technical-service-main'

export interface TechnicalServiceProccessProps extends Sites {
  data: {
    currentStep: number
  }
  template: ContentfulTemplateTechnicalServiceMain
  slug: string
}

export interface TechnicalServiceProps extends Sites {
  template: ContentfulTemplateTechnicalServiceMain
  slug: string
}
