import { SitesNames } from '../../types'

export const classes = {
  breadCrumbWrapper: 'px-4 pt-4',
  container: 'container mx-auto pt-4 lg:pt-8 min-h-[400px]',
  description: 'max-w-[800px] mx-auto',
  selectWrapper: 'max-w-[330px] md:max-w-[400px] mx-auto mt-4',
  selectOptions:
    'min-w-[330px] lg:min-w-[400px] !max-h-48 overflow-y-auto mt-2',
  cardsContainer:
    'flex flex-col justify-center items-center md:flex-row px-4 mb-14 mt-8 md:mt-12 md:gap-x-4 gap-y-4',
  modelWrapper: 'flex flex-col items-center gap-y-8 mb-[4.5rem] px-4',
  modelTitle: 'text-lg md:text-xl font-medium text-gray-600 text-center'
}

export const getSiteClasses = (site: SitesNames) => {
  const siteClasses = {
    title: ''
  }

  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      siteClasses.title = '!text-SI-primary-dark'
  }

  return siteClasses
}
