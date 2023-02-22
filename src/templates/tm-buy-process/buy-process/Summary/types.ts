import { BuyProcessProps } from '../../types'

export type SummaryProps = Pick<BuyProcessProps, 'data' | 'site'>

export type SummaryDataGroup = { title: string; items: any[] }
