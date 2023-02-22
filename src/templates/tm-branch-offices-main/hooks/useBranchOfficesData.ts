import { useState, useEffect } from 'react'
import { fetchBranchOfficesData } from '../api'
import { DataType, SelectOption, useBranchOfficesProps } from '../types'

export const useBranchOfficesData = ({
  data,
  service,
  city,
  brand,
  site
}: useBranchOfficesProps): [SelectOption[], boolean] => {
  const [branchOfficesData, setBranchOfficesData] = useState(
    [] as SelectOption[]
  )

  const [loadingBranchOfficesData, setLoadingBranchOfficesData] =
    useState(false)

  // En base al tipo de data realiza una peticion al fetch correspondiente
  useEffect(() => {
    switch (data) {
      case DataType.SERVICES:
        setLoadingBranchOfficesData(true)
        fetchBranchOfficesData(site, DataType.SERVICES, service, city, brand)
          .then((data) => {
            setBranchOfficesData(() => [
              {
                value: 'TODOS',
                slug: 'todos',
                label: 'Todos'
              },
              ...data
            ])
          })
          .finally(() => setLoadingBranchOfficesData(false))
        break
      case DataType.CITIES:
        setLoadingBranchOfficesData(true)
        fetchBranchOfficesData(site, DataType.CITIES, service, city, brand)
          .then((data) => {
            setBranchOfficesData(() => [
              {
                value: 'TODOS',
                slug: 'todos',
                label: 'Todas'
              },
              ...data
            ])
          })
          .finally(() => setLoadingBranchOfficesData(false))
        break
      case DataType.BRANDS:
        setLoadingBranchOfficesData(true)
        fetchBranchOfficesData(site, DataType.BRANDS, service, city, brand)
          .then((data) => {
            setBranchOfficesData(() => [
              {
                value: 'TODOS',
                slug: 'todos',
                label: 'Todas'
              },
              ...data
            ])
          })
          .finally(() => setLoadingBranchOfficesData(false))
        break
      default:
        setLoadingBranchOfficesData(false)
        break
    }
  }, [city, service, brand])

  return [branchOfficesData, loadingBranchOfficesData]
}
