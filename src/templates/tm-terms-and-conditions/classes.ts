import { SitesNames } from '../../types'

export const classes = {
  container:
    'w-full max-w-screen-xl mx-auto px-4 md:px-2 lg:px-6 pb-12 md:pb-8',
  breadcrumb: 'mt-4 md:mt-8 mb-3 lg:mb-4 px-4',
  description: 'mx-auto max-w-[51rem] !text-gray-400',
  sidebar: 'bg-white rounded-2xl border border-gac-main-01 overflow-hidden',
  sidebarHeight:
    'max-h-[95vh] overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
  sidebarWrapper:
    'hidden md:flex w-[15rem] lg:w-[18.5rem] flex-shrink-0 sticky top-4',
  contentWrapper: 'flex relative items-start mt-2 md:mt-10 lg:mt-12 md:gap-x-8',
  textWrapper: 'flex-grow w-full',
  sidebarTitle:
    'text-base font-medium text-gray-900 py-4 px-4 border-b border-gac-main-01',
  sidebarLink:
    'flex py-4 px-4 border-b border-gac-main-01 cursor-pointer text-xs',
  mobile: {
    contentWrapper: 'w-full md:hidden',
    wrapper: 'border-b border-gac-main-01',
    title:
      'text-base font-medium text-gray-900 py-4 px-4 border-b border-gac-main-01',
    item: 'border-b border-gac-main-01 last:border-b-0',
    richText: 'px-4 pb-4'
  },
  desktop: {
    contentWrapper: 'w-full hidden md:block',
    section:
      'border-b border-gac-main-01 pb-20 mb-20 last:border-b-0 last:pb-0 last:mb-0',
    sectionTitle: 'text-3xl mb-8 font-medium text-gray-900',
    item: 'mb-8 last:mb-0',
    itemTitle: 'text-xl font-medium text-gray-900 mb-4',
    boldItemTitle: 'text-2xl font-bold text-gray-900 leading-8 mb-4'
  }
}

export const getSiteClasses = (site: SitesNames) => {
  const classes = {
    title: '',
    sidebarLink: '',
    hoverLink:''
  }

  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      classes.title = '!text-SI-primary-dark'
      classes.sidebarLink = 'text-SI-primary-dark'
      break

    case SitesNames.WIGO_MOTORS:
      classes.sidebarLink = 'text-gray-900'
      break

    case SitesNames.PORTILLO:
      classes.title = '!text-PO-primary-light'
      classes.sidebarLink = 'text-PO-primary-light'
      break

    case SitesNames.COSECHE:
      classes.hoverLink = 'hover:bg-gac-main-01'
    break

    default:
      break
  }

  return classes
}
