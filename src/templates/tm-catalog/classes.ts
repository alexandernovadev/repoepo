import { SitesNames } from '../../types'

export const TmCatalogClasses =
  'pt-6 pb-0 sm:py-10 px-4 sm:px-6 w-full xl:container xl:mx-auto'

export const ContainerClasses = 'flex justify-between'

export const SideBarClasses = 'mr-4 hidden lg:block'

export const ToolsClasses = {
  container: 'flex items-center justify-between',
  button:
    'hidden ml-2 rounded-2xl md:flex items-center justify-center bg-white border border-solid border-main-01 h-14 w-12',
  labelSort: 'hidden sm:block text-gray-600 font-bold text-sm',
  labelCars: 'hidden lg:block text-gray-900 font-normal text-sm',
  selectContainer: 'ml-2 sm:ml-6 !pl-3 pr-1',
  select: 'w-40 xs:w-60',
  selectChildren: 'w-40 xs:w-60 mt-[-2rem] md:mt-[-3rem] lg:mt-2',
  sidebar: 'lg:hidden'
}

export const InfoClasses = {
  title: 'text-2xl font-normal my-2',
  description: 'text-base font-normal text-gray-600'
}

export const ContainerCardsClasses =
  'lg:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 w-full max-w-sm mx-auto sm:max-w-full'

export const labelCarsClasses = 'text-gray-900 font-normal text-sm'

export const NotFoundClasses = {
  container: 'w-full flex items-center flex-col mt-10 sm:mt-14',
  title: 'mb-4 text-xl text-center sm:text-2xl font-medium text-black',
  description: 'text-base font-normal text-black',
  button: 'mt-8',
  separator: 'mt-8 mb-2 sm:my-8 w-full border-solid border-gray-300 border-t'
}

export const iconColumnClasses = (site?: SitesNames) => {
  switch (site) {
    case SitesNames.COSECHE:
      return 'fill-CO-primary-dark'
    case SitesNames.WIGO_MOTORS:
      return 'fill-WI-primary-dark'
    case SitesNames.PORTILLO:
      return 'fill-PO-primary-light'
    default:
      return 'fill-SI-primary-dark'
  }
}
