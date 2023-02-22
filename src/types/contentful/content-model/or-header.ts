import { ContentfulAsset } from '../common'
import { ContentfulMlMenuItem } from './ml-menu-item'
import { ContentfulAtButton } from './at-button'
import { ComponentContentType } from '../component-content-type'
import { ContentfulElement } from '../element'
import { HeaderVariant } from '../../Layouts'

export type ContentfulOrHeader = {
  brand?: ContentfulAsset
  brandLinkUrl?: string
  navigationMenu?: ContentfulMlMenuItem[]
  actionsMenu?: ContentfulMlMenuItem[]
  actionButton?: ContentfulAtButton
  variant: HeaderVariant
} & ContentfulElement<ComponentContentType.OR_HEADER>
