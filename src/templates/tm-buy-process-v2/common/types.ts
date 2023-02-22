import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { PropsWithChildren } from 'react'
import { Dispatch } from 'redux'
import { BuyProcessV2State } from '../../../redux/features/buyProcessV2Slice'
import {
  ContentfulAsset,
  ContentfulTemplateBuyProcess,
  Sites,
  SitesNames
} from '../../../types'
import { Car, Version } from '../../../types/contentful/car'

export interface BuyProcessV2Props extends Sites {
  state: BuyProcessV2State
  dispatch: Dispatch
  template?: ContentfulTemplateBuyProcess
  car?: Car
  hostName?: string
}

export interface MobileSummaryProps extends Sites {
  onClick(): void
  open: boolean
  state: BuyProcessV2State
  className?: string
}

export interface Warranty {
  title: string
  cashPrice: string
  creditPrice: string
  logo: ContentfulAsset
  modalContent: MlRichTextProps['text']
}

interface Card extends Sites {
  className?: string
  disabled: boolean
  selected: boolean
  onClick: () => void
}

export interface VersionStockProps extends Version {
  carId: string
  carColor?: null | {
    carMainColor: {
      id: string
      slug: string
      value: string
    },
    value: string
  }
}

export type ItemCardProps = PropsWithChildren<Card>

export interface SelectionButtonsProps extends BuyProcessV2Props {
  className?: string
  disabled?: boolean
  onClickAccepted: () => void
  onClickRejected: () => void
  labelAccepted: string
  labelRejected: string
  dispatch: Dispatch
  actionValueAccepted?: string
  actionValueRejected?: string
}

export interface DetailsSummary {
  site: SitesNames
  itemsSummary:SummaryDataGroup[]
  title: string
}


export type SummaryProps = Pick<BuyProcessV2Props, 'state' | 'site'>
export type SummaryDataGroup = { title: string; items: any[] }