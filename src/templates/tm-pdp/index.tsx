import { Pdp } from '../../components/Pdp'
import {
  PdpNotFound,
  VehicleNotFoundProps
} from '../../components/Pdp/notFound'
import { PdpProps } from '../../components/Pdp/types'
import { Car } from '../../types/contentful/car'

export const TmPdp = (
  props: (PdpProps & { car: Car }) | VehicleNotFoundProps
) => {
  if (props.notFound) {
    return <PdpNotFound {...(props as VehicleNotFoundProps)} />
  }

  return <Pdp {...(props as PdpProps)} car={props.car as Car} />
}
