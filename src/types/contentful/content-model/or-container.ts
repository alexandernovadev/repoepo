import { TextAlignment } from '@gac/core-components/lib/@types/common'
import { ContentfulMlHeading } from '.'
import { Sites } from '../common'
import { ContentfulContainerBlock } from '../container-block'

export interface ContentfulOrContainer extends Sites {
  blocks: ContentfulContainerBlock[]
  layout: LayoutType
  backgroundColor: BackgroundContainerColor
  topPadding: ContainerPaddingSize
  bottomPadding: ContainerPaddingSize
  horizontalPadding: ContainerPaddingSize
  display: Display
  columns: ContainerColumnDesktop
  columnsTablet: ContainerColumnTablet
  columnsMobile: ContainerColumnMobile
  blocksGap: ContainerGap
  heading: ContentfulMlHeading
  buttonAlignment: ButtonAlignment
  buttonMargin: ContainerPaddingSize
  title?: string
  description?: string
  titleAndDescriptionAlignment?: TextAlignment
}

export enum LayoutType {
  CONTAINER = 'container',
  CONTAINER_FLUID = 'container-fluid'
}

export enum BackgroundContainerColor {
  WHITE = 'white',
  LIGHT = 'light',
  GRAY = 'gray',
  GRAY_100 = 'gray-100',
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

export enum ContainerPaddingSize {
  NONE = 'none',
  SMALL = 'small',
  MEDIUM = 'medium'
}

export enum ContainerColumnMobile {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four'
}

export enum ContainerColumnTablet {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five',
  SIX = 'six',
  TWELVE = 'twelve'
}

export enum ContainerColumnDesktop {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five',
  SIX = 'six',
  TWELVE = 'twelve'
}

export enum ContainerGap {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XXL = 'xxl'
}

export enum Display {
  BOTH = 'both',
  MOBILE_ONLY = 'mobile-only',
  DESKTOP_ONLY = 'desktop-only'
}

export enum ButtonAlignment {
  LEFT = 'left',
  MIDDLE = 'middle',
  RIGHT = 'right'
}
