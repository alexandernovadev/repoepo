import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { fetchBranchOffices } from '../api'
import { BranchOffice, FetchBranchOfficesParams } from '../types'

export const useBranchOffices = ({
  service,
  city,
  brand,
  site
}: FetchBranchOfficesParams): [BranchOffice[], Dispatch<SetStateAction<BranchOffice[]>>, boolean] => {
  const [branchOfficesData, setBranchOfficesData] = useState(
    [] as BranchOffice[]
  )

  const [loadingBranchOfficesData, setLoadingBranchOfficesData] =
    useState(false)

  useEffect(() => {
    setLoadingBranchOfficesData(true)

    fetchBranchOffices({ city, service, brand, site })
      .then(setBranchOfficesData)
      .finally(() => setLoadingBranchOfficesData(false))
  }, [city, service, brand])

  return [branchOfficesData, setBranchOfficesData, loadingBranchOfficesData]
}
