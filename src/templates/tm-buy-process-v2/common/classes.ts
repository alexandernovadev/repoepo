import { SitesNames } from '../../../types'

export const baseClasses = {
  baseContainer:
    'flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-center mb-20 lg:mb-24',
  summaryMargins: 'top-0 mt-12 sm:mt-14 md:mt-16',
  processContainer:
    'container px-5 xl:px-7 mt-24 sm:mt-28 lg:mt-12 lg:flex lg:gap-4',
  infoCard: 'hidden lg:block w-1/2 sticky top-12 h-fit'
}

export const mobileSummaryClasses = {
  container: 'lg:hidden fixed flex flex-col z-10 w-full bg-white',
  infoBar: 'flex justify-between align-middle px-5 py-2 shadow-horizontal',
  details: 'pt-4 pb-16 sm:pb-20 md:pb-24 px-5 overflow-y-auto'
}

export const summaryClasees = {
  mainContainer: 'flex flex-col p-[20px] justify-center items-center mt-8',
  vehicleCard: 'md:w-[603px] sm:w-full mt-8',
  titleSection: 'text-xl leading-7 text-gray-600 mb-4',
  detailsSection: 'bg-white rounded-2xl p-6 mt-8 lg:w-[816px] w-full',
  detailSectionDivider: 'md:flex md:gap-4',
  detailSectionColomnOne: 'md:w-2/4',
  detailSectionColomnTwo: 'md:w-2/4 mt-16 md:mt-0',
  cardSubtitle: 'text-xs text-gray-900 mb-2',
  itemListContainer: 'flex flex-col gap-2',
  cardSeparator: 'bg-main-01 my-4',
  cardSubtitleContact: 'text-xs text-gray-900 font-normal mb-2'
}

export const stepTitleClasses = 'text-xl leading-7 text-gray-600'
export const stepSubtitleClasses = 'leading-6 text-gray-600'
export const curveBezierStyle = {
  transitionTimingFunction: 'cubic-bezier(0.90, 0.62, 0.43, 0.98)'
}

// Terms and Conditions classes
export const modal_contentScrollTerms =
  'h-52 md:h-[20rem] overflow-x-scroll pr-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'

export const itemCardBorderClasses = (
  site: SitesNames,
  selected: boolean,
  disabled: boolean
) => {
  if (!selected || disabled) return 'border-gac-main-02 text-gray-600'

  switch (site) {
    default:
      return 'border-SI-primary-dark bg-gac-main-01 text-SI-primary-dark'
  }
}
