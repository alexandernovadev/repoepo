import { SitesNames } from "../../../../types"

export interface ModalPreAprobationProps {
  site: SitesNames,
  setOpenModal: Function,
  openModal: boolean
  dispatch: Function
}
