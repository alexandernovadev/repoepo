import { SitesNames } from '../../types'

export const TmBranchOfficesMainClasses = {
  branchOfficesContainer:
    'lg:order-first lg:h-full overflow-y-auto lg:w-[296px] w-full px-4 py-0 overflow-y-scroll scrollbar',
  mapContainer: 'h-[256px] sm:h-[693px] lg:w-[712px] flex flex-col',
  mapSection:
    'max-w-screen-lg mx-auto flex flex-col lg:flex-row lg:flex-1 gap-6 lg:gap-4 lg:h-[693px]',
  notFoundImage: 'mb-6 w-20',
  notFoundImageContainer:
    'bg-white flex flex-col py-14  items-center lg:bg-transparent lg:my-32',
  contentContainer: 'px-4 pb-8 sm:px-2 lg:px-4',
  selectsTransition: '!w-full',
  selectsOptions: 'left-0 right-0',
  selectsContainer: 'flex-1',
  selectsBoxContainer:
    'flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-[816px] mx-auto sm:justify-start',
  selectMainContainer: 'px-4 sm:px-2 xl:px-4 mt-2 mb-6 lg:mt-10 lg:mb-12',
  horizontalsBox: 'grid sm:grid-cols-2 gap-5 max-w-screen-lg mx-auto',
  horizontalsContainer: 'p-4 sm:px-2 lg:px-4',
  headingDescription: 'text-base !text-gray-400',
  headingTitle: 'text-xl',
  heading: 'pt-2',
  breadcrumb: 'p-4 sm:px-2 lg:px-4 mx-auto max-w-screen-xl',
  notFoundText:
    'text-base font-normal  leading-6 text-primary-dark text-center  md:text-xl md:leading-7'
}

export const getNotFoundTextClasses = (sites: SitesNames) => {
  const classes = {
    notFoundText:
      'text-base font-normal  leading-6 text-center  md:text-xl md:leading-7'
  }

  switch (sites) {
    case SitesNames.SALAZAR_ISRAEL:
      classes.notFoundText += ` text-${sites}-primary-dark`

      break
    case SitesNames.WIGO_MOTORS:
      classes.notFoundText += ' text-gray-900 '
      break

    default:
      break
  }

  return classes
}
