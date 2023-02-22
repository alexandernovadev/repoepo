import { SitesNames } from '../../types'

export const Classes = {
  heading: 'py-4 text-center mb-10',
  headingSubtitle: 'text-gray-600 text-lg md:text-xl',
  card: 'bg-white rounded-2xl shadow-horizontal',
  mainContainer: 'mt-10 py-10 w-full flex flex-col items-center md:px-6',
  summaryCard:
    'w-full mt-10 py-4 px-4 md:py-6 md:px-10 flex flex-col md:flex-row gap-y-10 md:gap-y-0 md:gap-x-12',
  summaryContent: 'w-full md:w-1/2 py-4 space-y-2',
  summaryTitle: 'text-center md:text-left text-gray-600 text-xl mb-4',
  summarySubtitle: 'text-center md:text-left text-gray-900 text-xs mb-2',
  personalItem: 'text-gray-900 text-sm break-words',
  buttonWrapper: 'flex gap-4 mt-10'
}

export const getHeadingSiteClasses = (sites: SitesNames) => {
  const classes = {
    title: 'text-2xl md:text-3xl mb-[0.625rem] '
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
