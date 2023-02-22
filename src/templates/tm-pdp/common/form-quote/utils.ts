import { SitesNames } from '../../../../types'

export const getClientParam = (site: SitesNames, clientParam: string) => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return { rut: clientParam }
    case SitesNames.WIGO_MOTORS:
      return { dni: clientParam }
    default:
      return { rut: clientParam }
  }
}
