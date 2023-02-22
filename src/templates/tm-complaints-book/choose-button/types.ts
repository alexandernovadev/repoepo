import { Sites } from '../../../types'

export interface optionsButtonsProps {
  label: string, description: string
}

export interface ChooseButtonsProps extends Sites{
  buttonsData: {
    options: Array<optionsButtonsProps>,
    showDecriptions: boolean
  },
  activeButton: string,
  setActiveButton: (label: string) => void
}