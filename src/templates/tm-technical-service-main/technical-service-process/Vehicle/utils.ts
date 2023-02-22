import { SitesNames } from '../../../../types'

export const formatAvailableYears = (
  initialYear?: number,
  finalYear?: number
): Array<string> => {
  let years: Array<string> = []

  if (initialYear && finalYear) {
    for (let index = initialYear; index <= finalYear; index++) {
      years.push(index.toString())
    }
  }

  return years.reverse()
}

export const getSearchRutQuery = (site: SitesNames): string => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return 'rut='
    case SitesNames.WIGO_MOTORS:
      return 'dni='
    default:
      return 'rut='
  }
}

export const getSearchRutByTitle = (site: SitesNames): string => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return 'RUT'
    case SitesNames.WIGO_MOTORS:
      return 'DNI'
    default:
      return 'RUT'
  }
}

export const getMaintenanceTextVariant = (site: SitesNames): string => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return 'Mantención'
    case SitesNames.WIGO_MOTORS:
      return 'Mantenimiento'
    default:
      return 'Mantención'
  }
}

export const getPatentTextVariant = (site: SitesNames): string => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return 'Patente'
    case SitesNames.WIGO_MOTORS:
      return 'Placa'
    default:
      return 'Patente'
  }
}
