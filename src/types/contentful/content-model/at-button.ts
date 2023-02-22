import { Target } from '@gac/core-components/lib/atomic-components-react/utils/target'
import { Sites } from '../common'

export interface ContentfulAtButton extends Sites {
  label: string
  variant: AtButtonVariant
  target: Target
  actionType?: AtButtonActionType
  actionValue?: string
  disabled?: boolean
}

export enum AtButtonVariant {
  PRIMARY = 'primary',
  PRIMARY_OUTLINED = 'primary-outlined',
  PRIMARY_CHEVRON = 'primary-chevron',
  WHITE_OUTLINED = 'white-outlined',
  PRIMARY_TEXT = 'primary-text',
  WHITE_TEXT = 'white-text',
  SECONDARY_TEXT = 'secondary-text',
  SORT_ICON = 'sort-icon',
  LOADING = 'loading',
  ARROW_PREV = 'arrow-prev',
  ARROW_NEXT = 'arrow-next',
  LIGHT_OUTLINED = 'light-outlined'
}

export enum AtButtonActionType {
  OPEN_URL = 'Open URL',
  GO_BACK = 'Go back',
  SCROLL_TO = 'Scroll to'
}
