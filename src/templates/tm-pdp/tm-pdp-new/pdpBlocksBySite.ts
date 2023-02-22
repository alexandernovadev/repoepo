import { SitesNames } from '../../../types'
import { renderPdpBlockTypes } from './types'

export const pdpBlocksBySite = (site: SitesNames) => {
  switch (site) {
    case SitesNames.COSECHE:
      return [
        renderPdpBlockTypes.CAR_SLIDER,
        renderPdpBlockTypes.OR_CAR_DETAIL,
        renderPdpBlockTypes.EQUIPMENT,
        renderPdpBlockTypes.CARDS,
        renderPdpBlockTypes.VERSIONS
      ]

    default:
      return [
        renderPdpBlockTypes.VERSIONS,
        renderPdpBlockTypes.CARDS,
        renderPdpBlockTypes.OR_CAR_DETAIL
      ]
  }
}