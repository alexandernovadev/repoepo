import { SitesNames } from '../../types'

export const tmQuotationBodyClasses =
  'flex flex-col items-center gap-8 mb-8 mt-20 md:mt-[5.5rem] lg:mt-8'

export const cardClasses =
  'bg-white shadow-tm-quote-card w-full md:w-[25rem] p-6 rounded-2xl flex flex-col gap-4'

export const cardImageClasses =
  'object-cover rounded-[1.25rem] border max-h-[13.375rem] shadow-default'

export const cardSectionTitleClasses = 'text-xs text-gray-900 mb-2'

export const quoteDataItemClassesMultiLine = {
  container: 'md:flex md:justify-between w-full md:gap-2',
  title: 'text-sm font-light text-gray-600 md:w-1/2',
  detail: 'text-sm md:text-right md:w-1/2'
}

export const quoteDataItemClassesSingleLine = {
  container: 'flex justify-between w-full gap-2',
  title: 'text-sm font-light text-gray-600 w-1/2',
  detail: 'text-sm text-right w-1/2'
}

export const getQuoteDataItemSiteClasses = (sites: SitesNames) => {
  const classes = {
    detail: 'whitespace-pre-line break-words '
  }

  switch (sites) {
    case SitesNames.PORTILLO:
      classes.detail += `text-${sites}-primary-light`
      break

    case SitesNames.SALAZAR_ISRAEL:
      classes.detail += `text-${sites}-primary-dark`
      break

    case SitesNames.WIGO_MOTORS:
      classes.detail += `text-${sites}-secondary-dark `
      break

    default:
      break
  }

  return classes
}
