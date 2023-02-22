import { SitesNames } from '../../../../types'

export const getClientParam = (site: SitesNames, clientParam: string) => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return { clientRut: clientParam }
    case SitesNames.WIGO_MOTORS:
      return { clientDni: clientParam }
    default:
      return { clientRut: clientParam }
  }
}
