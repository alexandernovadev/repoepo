import { AtButtonProps } from '@gac/core-components'
import { TextAlignment } from '@gac/core-components/lib/@types/common'
import { MlHeadingProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-heading/types'
import { ContainerGap, ContentfulMlCardNews } from '.'
import { Sites } from '../common'
import {
  BackgroundContainerColor,
  ButtonAlignment,
  ContainerPaddingSize
} from './or-container'

export interface ContentfulOrNewsContainer extends Sites {
  backgroundColor: BackgroundContainerColor
  topPadding: ContainerPaddingSize
  bottomPadding: ContainerPaddingSize
  horizontalPadding: ContainerPaddingSize
  title?: string
  description?: string
  titleAndDescriptionAlignment?: TextAlignment
  heading?: MlHeadingProps
  button?: AtButtonProps
  buttonAlignment?: ButtonAlignment
  buttonMargin?: ContainerPaddingSize
  blocksGap: ContainerGap
  news: ContentfulMlCardNews[]
}
