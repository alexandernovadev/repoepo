import { ReactNode } from 'react'
import { ContentfulPgPage } from '../../types'
import { Sites } from '../contentful'

export enum HeaderVariant {
  LIGHT = 'light',
  DEFAULT = 'default'
}

export interface LayoutProps extends Sites {
  templateType?: string
  pageTitle: string
  contentfulPage: ContentfulPgPage
  children?: ReactNode
}

export interface pricesProps {
  priceCC: number
  priceSC: number
  priceSP: number
  priceOP: number
  listPrice: number
  brandBonusSP: number
  dealerBonusCC: number
  dealerBonusSC: number
  dealerBonusSP: number
  financingBonusCC: number
  financingBonusSC: number
  financingBrandBonusCC: number
  financingBrandBonusSC: number
  currency: string
}
