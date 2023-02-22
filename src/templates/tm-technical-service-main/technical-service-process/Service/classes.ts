import { AtButtonVariant, SitesNames } from '../../../../types'

export const card =
  'bg-white shadow-card rounded-2xl w-full mt-8 px-6 py-10 md:px-16'

export const ServiceClasses = {
  container: 'px-5 md:px-2 lg:px-6 mb-8 w-full',
  cardFeatures: `${card}  md:px-20 pb-0 lg:px-6`,
  card: `${card} flex flex-col items-center`,
  carCardContainer:
    ' md:flex md:justify-center mx-7 md:max-w-[500px] md:mx-auto',
  title:
    ' text-xl font-normal leading-7  text-gray-600 my-10 md:mb-16 lg:mb-10 text-center mx-6',
  servicesContainer: 'pb-14 lg:flex lg:gap-4 lg:justify-center',
  servicesIcon: 'lg:!w-14 lg:!h-12',
  servicesTitle:
    'lg:text-xl lg:leading-7 lg:text-center lg:text-gray-600 lg:font-medium lg:h-14 whitespace-nowrap overflow-hidden  overflow-ellipsis md:whitespace-normal md:overflow-auto',
  services:
    'mb-2  shadow-card text-sm !pointer-events-auto !max-w-none lg:!w-56  lg:!h-40 cursor-pointer',
  servicesSectionTitle: 'text-lg font-medium  leading-7 mb-4 text-gray-600',
  servicesSectionDescription: 'text-base  leading-6 pb-10',
  buttonsContainer: 'flex justify-center mt-12',
  cardTitle: 'text-xl font-normal leading-7 text-center text-gray-600 mb-10',
  dropdownPlacholder: 'w-full overflow-hidden overflow-ellipsis',
  input: 'max-w-[608px] !w-full'
}

export const getBackButtonSiteVariants = (sites: SitesNames) => {
  const backbuttonSiteVariants = {
    variant: ''
  }

  switch (sites) {
    case SitesNames.SALAZAR_ISRAEL:
      backbuttonSiteVariants.variant += `${AtButtonVariant.PRIMARY_TEXT}`
      break
    case SitesNames.WIGO_MOTORS:
      backbuttonSiteVariants.variant += `${AtButtonVariant.SECONDARY_TEXT}`
      break
  }
  return backbuttonSiteVariants
}
