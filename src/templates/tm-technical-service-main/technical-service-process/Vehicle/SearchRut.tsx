import { AtButton, MlHeading } from '@gac/core-components'
import { useEffect, useMemo, useState } from 'react'
import { AtButtonVariant, BackgroundContainerColor } from '../../../../types'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { getHeadingSiteClasses, VehicleStepClasses } from './classes'
import { SearchRutProps } from './types'
import { VehicleForm } from './VehicleForm'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCurrentRut,
  technicalServiceSelector,
  updatePersonalData
} from '../../../../redux/features/technicalServiceSlice'
import { newCarToAdd } from './formatSearchData'
import {
  getMaintenanceTextVariant,
  getSearchRutByTitle,
  getSearchRutQuery
} from './utils'
import { renderSearchInput } from './renderSearchInput'

const ENDPOINT_RUT = 'customer/api/gac-soap/cars-by-rut?'

export const SearchRut = ({
  site,
  openModal,
  showForm,
  setSelectedVehicleOnRedux
}: SearchRutProps) => {
  const dispatch = useDispatch()
  const { currentRut, personalData } = useSelector(technicalServiceSelector)
  const [rutState, setRutState] = useState({
    value: currentRut || '',
    error: true
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState([])

  useEffect(() => {
    if (currentRut !== '' && currentRut) {
      setRutState({
        value: currentRut,
        error: false
      })
    }
  }, [])

  const onHandleClick = async (variant: string) => {
    if (variant === 'button') setLoading(true)

    try {
      const response = await fetchWithoutToken(
        `${ENDPOINT_RUT}${getSearchRutQuery(site)}${rutState.value}`,
        site
      )

      if (response.error && response.error.toUpperCase() === 'NOT FOUND') {
        dispatch(updatePersonalData({ ...personalData, fetched: true }))
      }
      if (response.result && response.result.length > 0) {
        openModal(response.result)
        setResponse(response.result)
      } else {
        setSelectedVehicleOnRedux(newCarToAdd)
      }
    } catch (error) {
      console.log(error)
    }
    if (variant === 'button') setLoading(false)
  }

  const onDniError = (dniError: boolean) => {
    setRutState({
      ...rutState,
      error: dniError
    })
  }

  const headingClasses = useMemo(() => {
    return getHeadingSiteClasses(site)
  }, [site])
  return (
    <div className={VehicleStepClasses.searchRutClasses.container}>
      <MlHeading
        title={`Agenda tu ${getMaintenanceTextVariant(site)} en línea`}
        description='En 4 simples pasos'
        backgroundColor={BackgroundContainerColor.LIGHT}
        titleClassName={headingClasses.title}
        descriptionClassName={headingClasses.description}
        site={site}
      />

      <div
        className={`${VehicleStepClasses.searchRutClasses.card} ${
          showForm ? 'md:pb-10' : 'md:pb-20'
        }`}
      >
        <h3 className={VehicleStepClasses.searchRutClasses.title}>
          Ingresa tu {getSearchRutByTitle(site)}
        </h3>

        <form
          className={VehicleStepClasses.searchRutClasses.flexBox}
          typeof='submit'
        >
          {renderSearchInput(
            site,
            rutState.value,
            ({ value, error }) => {
              setRutState({
                value: value,
                error: error
              })
            },
            onDniError
          )}
          <AtButton
            label='buscar'
            onClick={(e) => {
              e.preventDefault()
              dispatch(setCurrentRut(rutState.value))
              onHandleClick('button')
            }}
            disabled={rutState.error || !rutState.value}
            variant={
              loading
                ? AtButtonVariant.LOADING
                : AtButtonVariant.PRIMARY_OUTLINED
            }
            className={`${VehicleStepClasses.searchRutClasses.button} ${
              rutState.error ? 'mt-8' : 'mt-5'
            }`}
            site={site}
          />
        </form>

        {/* Formulario Vehiculo */}
        {showForm && (
          <VehicleForm
            site={site}
            openModal={() => {
              if (response.length === 0) {
                onHandleClick('')
              } else {
                openModal(response)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
