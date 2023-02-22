import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { ContentfulMlHeading } from './content-model'

export interface Sites {
  site: SitesNames
}

export enum SitesNames {
  SALAZAR_ISRAEL = 'SI',
  COSECHE = 'CO',
  PORTILLO = 'PO',
  WIGO_MOTORS = 'WI',
  CARFLEX = 'CA',
  CLICAR = 'CL',
  GARANTIPLUS = 'GA'
}

export type ContentfulAsset = {
  title: string
  description?: string
  file: {
    fileName: string
    url: string
    details: {
      size: number
      image: {
        width: number
        height: number
      }
    }
  }
}

export type ContentfulTags = {
  CONTENTFUL_ID: string
  CONTENT_TYPE: string
  color: string
  iconTag: {
    file : {
      url: string,
      fileName: string,
      details: {
        image: {width: number, height: number}
        size: number
      }
    }
  }
  label: string
  name: string
  tagId: string
  textColor: string
  tagHeading: ContentfulMlHeading
  description: MlRichTextProps['text']
}

export enum Target {
  SELF = '_self',
  BLANK = '_blank'
}

export enum AtTabHeaderVariants {
  DEFAULT = 'default',
  LARGE = 'large'
}

export interface WithAnalyticsData {
  analyticsData: Record<string, unknown>
}

export interface WithUtmParams {
  sendUtmParams: boolean
}

export enum ContentfulTemplateType {
  TmCatalog = 'tmCatalog',
  TmCertificates = 'tmCertificates',
  TmPdp = 'tmPdp',
  TmError = 'tmError',
  TmNewsDetail = 'tmNews',
  TmQuotation = 'tmQuotation',
  TmBuyProcess = 'tmBuyProcess',
  TmQuoteSummary = 'tmQuoteSummary',
  TmTechnicalServiceSuccess = 'TmTechnicalServiceSuccess',
  TmMaintenanceGuidelines = 'TmMaintenanceGuidelines',
  TmBranchOfficesMain = 'TmBranchOfficesMain',
  TmTermsAndConditions = 'TmTermsAndConditions',
  TmCustomerService = 'tmCustomerService',
  TmComplaintsBook = 'TmComplaintsBook'
}

export type IconType =
  | 'angle-down'
  | 'angle-down-blue'
  | 'brand'
  | 'stars'
  | 'instagram-white'
  | 'facebook-white'
  | 'linkedin-white'
  | string
