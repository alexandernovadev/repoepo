import { ContentfulAsset } from '@gac/core-components/lib/@types/common'
import { BlockContentType } from '../block-content-type'
import { ContentfulElement } from '../element'

export type ContentfulOrHomeBanner = {
  bgImageDesktop: ContentfulAsset
  bgImageMobile: ContentfulAsset
  title: string
  showFilter: boolean
  buttonLabel: string
  isH1: boolean
  activeFilters: Array<string>
  moveFilterInVertical:  string
} & ContentfulElement<BlockContentType.OrHomeBanner>
