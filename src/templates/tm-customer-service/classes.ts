import { MlCollapsibleVariant } from '@gac/core-components'
import { SitesNames } from '../../types'

export const formContainerClasses =
  'flex flex-col md:mt-4 lg:mt-6 mb-12 md:mb-10 lg:mb-12 items-center w-full'

export const formFieldsClasses =
  'flex flex-col gap-10 w-full bg-white shadow-horizontal py-10 px-6 md:px-[4.5rem] lg:px-[6.5rem] rounded-2xl'

export const confirmationContainerClasses =
  'flex flex-col items-center gap-10 w-[90%] sm:w-full bg-white shadow-horizontal py-10 px-5 md:px-10 rounded-2xl text-center border border-gac-main-02'

export const formTitleClasses = 'text-gray-600 text-xl leading-7 text-center'

export const siteClasses = (site: SitesNames) => {
  const classes = {
    title: '',
    email: '',
    iconWrapper: ''
  }

  switch (site) {
    case SitesNames.PORTILLO:
      classes.title = `text-${site}-primary-light`
      classes.email = `text-${site}-primary-light`
      classes.iconWrapper = `text-${site}-primary-light`
      break
    case SitesNames.WIGO_MOTORS:
      classes.title = 'text-gray-900'
      classes.email = `text-${site}-primary-dark`
      classes.iconWrapper = `text-${site}-primary-dark`
      break
    case SitesNames.COSECHE:
    case SitesNames.SALAZAR_ISRAEL:
      classes.title = `text-${site}-primary-dark`
      classes.email = `text-${site}-primary-dark`
      classes.iconWrapper = `text-${site}-secondary-dark`
      break
  }

  return classes
}

export const variantSelector = (index: number, length: number) => {
  if (length === 1) return MlCollapsibleVariant.ROUND
  if (index === 0) return MlCollapsibleVariant.ROUND_TOP
  if (index === length - 1) return MlCollapsibleVariant.ROUND_BOTTOM
  return MlCollapsibleVariant.MIDDLE
}
