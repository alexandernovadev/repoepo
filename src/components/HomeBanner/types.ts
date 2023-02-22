import { Sites } from '../../types'
import {
  ContentfulAsset,
} from '@gac/core-components/lib/@types/common'

export interface HomeBannerProps extends Sites {
  bgImageDesktop: ContentfulAsset
  bgImageMobile: ContentfulAsset
  title: string
  showFilter: boolean
  buttonLabel: string
  isH1: boolean
  moveFilterInVertical:  string
  activeFilters: Array<string> | any
}