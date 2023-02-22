import { Sites } from '../../types'
import {
  ContentfulTemplateTermsAndConditions,
  Section
} from '../../types/contentful/content-model/tm-terms-and-conditions'

export interface TmTermsAndConditionsProps extends Sites {
  template: ContentfulTemplateTermsAndConditions
}

export interface ContentProps extends Sites {
  sections: Section[]
}

export interface SidebarProps extends Sites {
  data: Sidebar[]
}

export interface Sidebar {
  title: string
  links: {
    title: string
    href: string
  }[]
}
