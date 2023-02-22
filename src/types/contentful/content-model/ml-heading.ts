import {
  BackgroundContainerColor,
  TextAlignment
} from '@gac/core-components/lib/@types/common'
import { MlHeadingVerticalPadding } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-heading/types'
import { ContainerPaddingSize } from '@gac/core-components/lib/atomic-components-react/components/UI/organism/or-container/types'
import { Sites } from '../common'

export interface ContentfulMlHeading extends Sites {
  title: string
  titleClassName?: string
  description?: string
  descriptionClassName?: string
  alignment?: TextAlignment
  isH1?: boolean
  marginBottom: ContainerPaddingSize
  paddingBottom?: MlHeadingVerticalPadding
  paddingTop?: MlHeadingVerticalPadding
  backgroundColor: BackgroundContainerColor
}

export enum MlHeadingTextColor {
  DARK = 'dark',
  LIGHT = 'light'
}
