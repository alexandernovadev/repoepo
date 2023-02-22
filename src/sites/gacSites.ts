
export const findContentfulSite = (site: string) => {
  const currentSite = site?.toLowerCase()

  if (currentSite?.includes('salazarisrael')) {
    return 'Salazar Israel'
  } else if (currentSite?.includes('wigo')) {
    return 'Wigo Motors'
  } else if (currentSite?.includes('portillo')) {
    return 'Portillo'
  } else if (currentSite?.includes('coseche')) {
    return 'Coseche'
  } else {
    return 'Salazar Israel'
  }
}

export const gacSites = (site: string) => {
  const currentSite = site?.toLowerCase()

  if (currentSite?.includes('salazarisrael')) {
    return 'SI'
  } else if (currentSite?.includes('wigo')) {
    return 'WI'
  } else if (currentSite?.includes('portillo')) {
    return 'PO'
  } else if (currentSite?.includes('coseche')) {
    return 'CO'
  } else {
    return 'SI'
  }
}

export const getGubagooKeyBySite = (site: string) => {
  switch (site) {
    case 'SI':
      return JSON.parse(process.env.NEXT_PUBLIC_GUBAGOO as string)['SI']
    case 'WI':
      return JSON.parse(process.env.NEXT_PUBLIC_GUBAGOO as string)['WI']
    case 'CO':
      return JSON.parse(process.env.NEXT_PUBLIC_GUBAGOO as string)['CO']
    case 'PO':
      return JSON.parse(process.env.NEXT_PUBLIC_GUBAGOO as string)['PO']
    default:
      return JSON.parse(process.env.NEXT_PUBLIC_GUBAGOO as string)['SI']
  }
}

export const getGTMKeyBySite = (site: string) => {
  switch (site) {
    case 'SI':
      return JSON.parse(process.env.NEXT_PUBLIC_GTM_KEY as string)['SI']
    case 'WI':
      return JSON.parse(process.env.NEXT_PUBLIC_GTM_KEY as string)['WI']
    case 'CO':
      return JSON.parse(process.env.NEXT_PUBLIC_GTM_KEY as string)['CO']
    case 'PO':
      return JSON.parse(process.env.NEXT_PUBLIC_GTM_KEY as string)['PO']
  }
}

export const getSiteName = (site: string) => {
  switch (site) {
    case 'SI':
      return 'Salazar Israel'
    case 'WI':
      return 'Wigo Motors'
    case 'CO':
      return 'Coseche'
    case 'PO':
      return 'Portillo'
    default:
      return ''
  }
}