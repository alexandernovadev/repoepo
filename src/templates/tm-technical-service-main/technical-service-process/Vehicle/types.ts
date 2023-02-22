import { Dispatch, SetStateAction } from 'react'
import { SitesNames } from '../../../../types'
import { ContentfulTemplateTechnicalServiceMain } from '../../../../types/contentful/content-model/tm-technical-service-main'

export interface SearchRutProps {
  site: SitesNames
  openModal: (data: Array<any>) => void
  showForm: boolean
  setSelectedVehicleOnRedux: (vehicle: radioButtonProps) => void
}

export interface ModalRutProps {
  site: SitesNames
  isModalOpen: boolean
  toggleModal: () => void
  searchData: Array<responseProps>
  selectVehicle: radioButtonProps | undefined
  setSelectVehicle: Dispatch<SetStateAction<any>>
  setShowForm: Dispatch<SetStateAction<any>>
  setSelectedVehicleOnRedux: (vehicle: radioButtonProps) => void
}

export interface VehicleFormProps {
  site: SitesNames
  openModal: () => void
}

export interface responseProps {
  brand: string
  model: string
  technicalModel: string
  year: string
  vin: string
  patent: string
  segment: string
}

export interface radioButtonProps {
  id: string
  title: string
  description?: string
}

export interface formatRadioButtonProps {
  id: string
  title: string
  description?: string
  brand?: string
  model?: string
  technicalModel?: string
  year?: string
  vin?: string
  patent?: string
  segment?: string
}

export interface VehicleProps {
  template: ContentfulTemplateTechnicalServiceMain
}
