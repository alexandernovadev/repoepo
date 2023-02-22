import { ContentfulAsset } from '@gac/core-components/lib/@types/common'
import { Target, IconType, Sites } from '../common'

export enum AtLinkVariants {
  HEADER = 'header',
  FOOTER = 'footer',
  BOTTOM_FOOTER = 'bottom-footer',
  WHITE_BOLD = 'white-bold',
  SOCIAL_MEDIA_ICON = 'social-media-icon',
  HEADER_SECONDARY = 'header-secondary',
  HORIZONTAL_INFO = 'horizontal-info',
  PDP_PHONE_NUMBER = 'pdp-phone-number',
  PDP_ADDRESS = 'pdp-address'
}

export interface ContentfulAtLink extends Sites {
  href?: string
  target?: Target | string
  label?: string
  variant?: AtLinkVariants | string
  iconType?: IconType
  iconClasses?: string
  iconUrl?: string
  icon?: ContentfulAsset
  file?: ContentfulAsset
}
