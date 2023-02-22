import {
  MlHeading,
  MlPdpCarImg,
  MlRichText,
  MlBrandProps
} from '@gac/core-components'
import { ComponentPropsWithoutRef } from 'react'
import { ContentfulAsset, ContentfulMlHorizontal, Sites } from '../../../types'
import { Car } from '../../../types/contentful/car'
import { PurchasingParameters } from '../../../types/contentful/content-model/tm-pdp'
import { Document } from '@contentful/rich-text-types'

export interface DetailsProps extends Sites, PurchasingParameters {
  car: Car
  version?: string
  brandData?: MlBrandProps | null
  openModal?: () => void
  usedFeatures?: ContentfulAsset[]
  availableColors?: boolean
}

export interface CardsSectionProps extends Sites {
  blocks: ContentfulMlHorizontal[]
  title?: string
}

export interface EquipmentProps extends Sites {
  isNew?: boolean
  equipments: string[][]
  title?: string
  backgroundColor?: 'white' | 'gray'
  description?: string
}

export interface AdditionalContentProps extends Sites {
  heading?: ComponentPropsWithoutRef<typeof MlHeading>
  content?: Omit<ComponentPropsWithoutRef<typeof MlRichText>, 'site'>
  className?: string
}

export type CertifiedUsedData = {
  tag?: ComponentPropsWithoutRef<typeof MlPdpCarImg>['tag']
  section?: Omit<AdditionalContentProps, 'site'>
}

export interface VehicleColorsProps extends Sites {
  car: Car
  description?: Document
  title?: string
  className?: string
  colors: Array<any>
  images: {
    [label: string]: string
  }
}
