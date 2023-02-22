import { checkOnlyConsonants } from '../../../utils/checkOnlyConsonants'
import { toCapitalize } from '../../../utils/toCapitalize'
import { CheckboxProps } from '../types'

export const formatSelectArray = (
  fetchData: Array<{ label: string; value: string; id: string; slug: string }>
) => {
  let formatData = fetchData?.map(
    (auxData: { label: string; value: string; id: string; slug: string }) => {
      return {
        label:
          auxData.value.length <= 3 || checkOnlyConsonants(auxData.value)
            ? auxData.value.toUpperCase()
            : toCapitalize(auxData?.value),
        value: auxData?.slug,
        id: auxData.id
      }
    }
  )

  return formatData
}

export const formatYearArray = (fetchYearData: Array<{ year: string }>) => {
  let formatYearData = fetchYearData?.map((auxData: { year: string }) => {
    return {
      label: auxData?.year,
      value: auxData?.year,
      id: auxData?.year
    }
  })

  return formatYearData
}

export const formatPriceArray = (fetchPriceData: Array<{ price: number }>) => {
  let formatPriceData = fetchPriceData?.map((auxData: { price: number }) => {
    return {
      label: auxData?.price.toLocaleString('es-CL'),
      value: auxData?.price.toLocaleString('es-CL'),
      id: auxData?.price
    }
  })

  return formatPriceData
}

export const formatMileageArray = (
  fetchMileageData: Array<{ mileage: number }>
) => {
  let formatMileageData = fetchMileageData?.map(
    (auxData: { mileage: number }) => {
      return {
        label: auxData?.mileage?.toLocaleString('es-CL') + 'km',
        value: auxData?.mileage?.toLocaleString('es-CL') + 'km',
        id: auxData?.mileage
      }
    }
  )

  return formatMileageData
}

export const formatCheckboxArray = (
  fetchData: Array<{ value: string; id: string }>,
  data: CheckboxProps
) => {
  const formatLabel = (name: string, value: string) => {
    switch (name) {
      case 'traccion':
        return value
      case 'puertas':
        return value + ' Puertas'
      case 'asientos':
        return value + ' Asientos'
      default:
        return toCapitalize(value)
    }
  }

  let formatFetchData = fetchData?.map(
    (auxData: { value: string; id: string }) => {
      if (auxData?.value) {
        return {
          checkLabel: formatLabel(data?.data?.name, auxData?.value),
          id: auxData?.id,
          checked: false
        }
      }
      return {}
    }
  )

  return formatFetchData.filter((item) => item.checkLabel)
}
