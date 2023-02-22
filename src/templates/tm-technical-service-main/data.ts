import { TechnicalServiceState } from '../../redux/features/technicalServiceSlice'
import { ContentfulAsset, ContentfulBrandProps, SitesNames } from '../../types'
import { formatPatent } from '../../utils/formatPatent'
import { formatPhoneNumber } from '../../utils/formatPhoneNumber'
import { toCapitalize } from '../../utils/toCapitalize'
import { getPatentTextVariant } from './technical-service-process/Vehicle/utils'

export const steps = [
  { label: 'Vehículo', index: 1 },
  { label: 'Servicio y cita', index: 2 },
  { label: 'Datos personales', index: 3 },
  { label: 'Confirmación', index: 4 }
]

const formatCardDate = (serviceDate: Date, serviceTime: Date) => {
  const date = new Date(serviceDate)
  const timeDate = new Date(serviceTime)

  const day = date.getDate()
  const month = toCapitalize(date.toLocaleDateString('es', { month: 'long' }))
  const year = date.getFullYear()
  const hours = timeDate.getHours()
  // el 0 y slice es para cambiar hora tipo 11:1 a 11:01
  const minutes = `0${timeDate.getMinutes()}`.slice(-2)

  return `${day} de ${month} de ${year} a las ${hours}:${minutes} horas`
}

export const mapServiceCardData = (
  formData: TechnicalServiceState['formVehicleData'],
  site: SitesNames
) => {
  const year = `Año ${formData.year}`
  const model = formData.technicalModel
    ? `${formData.technicalModel} - ${year}`
    : year
  const features = [
    {
      id: '1',
      label: formatPatent(formData.patent, site)
    }
  ]

  return {
    brand: toCapitalize(formData.brand),
    name: toCapitalize(formData.model),
    model,
    features
  }
}

export const mapCardImg = (
  logo: ContentfulAsset | null,
  brands: ContentfulBrandProps[] | null,
  vehicle: TechnicalServiceState['formVehicleData']
) => {
  let imageUrl = logo?.file.url as string
  let imageAlt = logo?.title as string

  const brandData = brands?.find(
    (item) => item.title.toLowerCase() === vehicle.brand.toLowerCase()
  )

  if (brandData) {
    imageUrl = brandData.brand.brandImage.file.url
    imageAlt = `${brandData.title} Logo`
  }

  return {
    imageUrl,
    imageAlt
  }
}

export const mapCardData = (
  serviceData: TechnicalServiceState['serviceData']
) => {
  const service = toCapitalize(serviceData.service?.value!)
  const address = serviceData.branchOffice?.address as string
  const date = formatCardDate(
    serviceData.date as Date,
    serviceData.time as Date
  )
  let advisor = ''

  if (serviceData.assessor?.name) {
    advisor = serviceData
      .assessor!.name.split(' ')
      .map((item) => toCapitalize(item))
      .join(' ')
  }

  return {
    name: service,
    model: address,
    subText: advisor ? `Asesor: ${advisor}` : '',
    features: [{ id: '1', label: date }]
  }
}

export const mapPersonData = (
  personalData: TechnicalServiceState['personalData'],
  rut: string
) => {
  const { name, phone, email } = personalData.form
  const formattedPhone = phone ? formatPhoneNumber(phone as string) : ''

  return [name, rut, formattedPhone, email]
}

export const getPatentFormat = (patent: string, site: SitesNames) => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return patent.replace(/(.{2})/g, '$1 ')
    case SitesNames.WIGO_MOTORS:
      return patent.replace(/(.{3})/g, '$1 ')
    default:
      return patent.replace(/(.{2})/g, '$1 ')
  }
}

export const mapDetails = (
  vehicleData: TechnicalServiceState['formVehicleData'],
  serviceData: TechnicalServiceState['serviceData'],
  site: SitesNames
) => {
  const details = [
    {
      name: 'Auto marca',
      value: vehicleData.brand
    },
    {
      name: 'Modelo',
      value: vehicleData.model
    }
  ]

  if (vehicleData.technicalModel) {
    details.push({
      name: 'Versión',
      value: vehicleData.technicalModel
    })
  }

  details.push({
    name: `${getPatentTextVariant(site)}`,
    value: `${getPatentFormat(vehicleData.patent, site)}`
  })

  details.push({
    name: 'Año',
    value: vehicleData.year
  })

  if (serviceData.mileage) {
    const value = parseInt(serviceData.mileage).toLocaleString('es-CL')

    details.push({
      name: 'Kilometraje',
      value: `${value} Kms`
    })
  }

  return details
}

export const QueryUrlData = [
  'step=one',
  'step=two',
  'step=three',
  'step=success'
]
