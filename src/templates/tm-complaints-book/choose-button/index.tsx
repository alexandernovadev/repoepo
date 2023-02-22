import { ChooseButtonClasses } from './classes'
import { ChooseButtonsProps, optionsButtonsProps } from './types'

export const ChooseButton = ({
  site,
  buttonsData,
  activeButton,
  setActiveButton
}: ChooseButtonsProps) => {
  const onChangeButton = (ev: any, label: string) => {
    ev.preventDefault()
    setActiveButton(label)
  }

  return (
    <div className={ChooseButtonClasses.container}>
      <label className={ChooseButtonClasses.label}>Seleccione una opción</label>
      <div className='w-full flex items-center justify-between gap-8 md:gap-0'>
        {buttonsData?.options?.map(
          (button: optionsButtonsProps, index: number) => (
            <button
              key={index}
              className={`${ChooseButtonClasses.button} ${
                activeButton === button.label
                  ? `bg-${site}-primary-dark text-white `
                  : 'bg-white text-gray-500'
              }
              `}
              onClick={(e) => onChangeButton(e, button.label)}
            >
              {button.label}
            </button>
          )
        )}
      </div>
      {buttonsData?.showDecriptions && (
        <div className={ChooseButtonClasses.containerMessage}>
          {buttonsData?.options?.map(
            (button: optionsButtonsProps, index: number) => (
              <p key={index} className={ChooseButtonClasses.text}>
                <span className='capitalize font-medium'>{button.label}: </span>
                {button.description}
              </p>
            )
          )}
        </div>
      )}
    </div>
  )
}
