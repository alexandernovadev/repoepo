import { SearchRut } from './SearchRut'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { ModalRut } from './ModalRut'
import { useEffect, useState } from 'react'
import { SitesNames } from '../../../../types'
import { radioButtonProps, responseProps } from './types'
import {
  setFormVehicleData,
  setVehicleData,
  technicalServiceSelector
} from '../../../../redux/features/technicalServiceSlice'
export const Vehicle = () => {
  const { site } = useSelector(commonSelector)
  const dispatch = useDispatch()
  const { vehicleData } = useSelector(technicalServiceSelector)
  const [openModal, setOpenModal] = useState(false)
  const [searchData, setSearchData] = useState<Array<responseProps>>([])
  const [showForm, setShowForm] = useState(false)
  const [selectVehicle, setSelectVehicle] = useState<
    radioButtonProps | undefined
  >(undefined)

  useEffect(() => {
    if (vehicleData?.active) {
      setShowForm(true)
    } else {
      setShowForm(false)
    }
  }, [vehicleData])

  const handleSearch = (data: Array<responseProps>) => {
    setOpenModal(true)
    setSearchData(data)
    setSelectVehicle(undefined)
  }

  const setSelectedVehicleOnRedux = (vehicle: radioButtonProps | undefined) => {
    if (!vehicle) return

    dispatch(
      setVehicleData({
        active: true,
        ...vehicle
      })
    )
    dispatch(
      setFormVehicleData({
        brand: null,
        model: null,
        year: null,
        vin: null,
        patent: null
      })
    )
  }

  return (
    <>
      <SearchRut
        site={site as SitesNames}
        openModal={(data) => handleSearch(data)}
        showForm={showForm}
        setSelectedVehicleOnRedux={setSelectedVehicleOnRedux}
      />
      <ModalRut
        site={site as SitesNames}
        isModalOpen={openModal}
        toggleModal={() => setOpenModal(!openModal)}
        searchData={searchData}
        selectVehicle={selectVehicle}
        setSelectVehicle={setSelectVehicle}
        setShowForm={setShowForm}
        setSelectedVehicleOnRedux={setSelectedVehicleOnRedux}
      />
    </>
  )
}
