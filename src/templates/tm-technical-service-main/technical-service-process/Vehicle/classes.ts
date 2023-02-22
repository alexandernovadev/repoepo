import { SitesNames } from '../../../../types'

export const VehicleStepClasses = {
  searchRutClasses: {
    container: 'w-full px-6',
    card: 'mt-10 rounded-2xl bg-white w-full flex flex-col items-center justify-center px-6 pt-10 pb-10 shadow-horizontal',
    title: 'mb-10 text-xl text-gray-600 font-normal',
    flexBox: 'flex flex-col md:flex-row items-center justify-center w-full',
    inputRut: 'w-full h-12 text-gray-800 sm:w-[476px]',
    button: 'h-8 md:mt-0 md:ml-9 w-[100px]'
  }
}

export const InputVehicleFormClasses = 'w-full sm:w-[476px] md:w-[608px]'

export const InputDropdownClasses =
  '!w-[17.5rem] sm:!w-[28.125rem] md:!w-[38rem] max-h-48 overflow-y-auto'

export const getHeadingSiteClasses = (sites: SitesNames) => {
  const classes = {
    title: 'text-2xl xl:text-3xl ',
    description: 'text-lg md:text-xl '
  }

  switch (sites) {
    case SitesNames.SALAZAR_ISRAEL:
      classes.title += `text-${sites}-primary-dark`

      break
    case SitesNames.WIGO_MOTORS:
      classes.title += 'text-gray-900 '
      break

    default:
      break
  }

  return classes
}

export const getChangeAutoLinkClasses = (sites: SitesNames) => {
  const classes = {
    link: '',
    icon: ''
  }

  switch (sites) {
    case SitesNames.SALAZAR_ISRAEL:
      classes.link += `text-${sites}-primary-dark`
      classes.icon = '#104990'

      break
    case SitesNames.WIGO_MOTORS:
      classes.link += `text-${sites}-secondary-dark `
      classes.icon = '#EE3124'

      break

    default:
      break
  }

  return classes
}
