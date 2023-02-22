import { AtLinkProps } from '@gac/core-components/lib/atomic-components-react/components/UI/atoms/at-link/types'

import { BlockContentType } from '../block-content-type'
import { ContentfulElement } from '../element'

export type ContentfulMlLinkList = {
  links: AtLinkProps[]
  linkColor?: 'white' | 'primary' | undefined
  className?: string
  linksClassName?: string
} & ContentfulElement<BlockContentType.MlLinkList>
