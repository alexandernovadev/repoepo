import { BuyProcessStateProps } from '../../../../redux/features/buyProcessSlice'
import { SitesNames } from '../../../../types'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { Chile } from '../../../../utils/regions/chile'
import { ChileLocation, Location } from '../../../../utils/regions/types'
import { toReCaptchaHeader } from '../../../../utils/toReCaptchaHeader'
import { PreApprovalMapFn, PreApprovalResponse } from '../../types'
import { optionIdSearch } from '../AdditionalData/preApprovalOptions'

const formatBuyProcessDate = (date: string) =>
  `${new Date(date).toISOString().split('T')[0].replace(/-/g, '/')}` // YYYY/MM/DD

const getLaborOldId = (laborOld: string) => {
  switch (laborOld) {
    case 'Menor a seis meses':
      return 'MENOR6MESES'

    case 'Mayor a siete meses':
      return 'MAYOR7MESES'

    case 'Mayor a dos años':
      return 'MAYOR2AÑOS'

    default:
      return ''
  }
}

  export const mapBaseUser = ({
  car,
  currentStep,
  contact
}: BuyProcessStateProps) => {
  const branch = car?.isNew
    ? car.newCarBranches?.find(
        (branch) => `${branch.name}, ${branch.commune}` === contact.contactData.branchOffice
      )
    : car?.usedCarBranchOffice

  let dni = contact.contactData.dni ?? contact.contactData.rut
  return {
    carId: parseInt(car?.id ?? '0'),
    message: contact.contactData.buyWindow
      ? `Flujo ${
          currentStep === 5 ? 'completo' : 'incompleto'
        }. Tiempo de intención de compra: ${contact.contactData.buyWindow}`
      : undefined,
    branchOfficeId: parseInt(branch?.id ?? '0'),
    dni,
    rut: contact.contactData.rut,
    name: `${contact.contactData.name} ${contact.contactData.lastNames}`,
    email: contact.contactData.email,
    phoneNumber: contact.contactData.phone
  }
}

// TODO: Not ready for Wigo
export const mapAppraisal = ({
  isAppraisingCar,
  hasAcceptedAppraisal,
  appraisalSimulation,
  appraisal
}: BuyProcessStateProps) => {
  const partPaymentCar =
    (!!isAppraisingCar && !!hasAcceptedAppraisal) ||
    (appraisal?.year !== '' &&
      appraisal?.mileage !== '' &&
      appraisal?.brand !== '' &&
      appraisal?.model !== '' &&
      appraisal?.version !== '')

  return {
    partPaymentCar,
    ...(partPaymentCar
      ? {
          partPaymentCarYear: appraisal?.year.toString(),
          partPaymentCarMileage:
            parseInt(appraisal?.mileage.replace(/\D/g, '')) ?? 0,
          partPaymentCarBrand: appraisal?.brand,
          partPaymentCarModel: appraisal?.model,
          partPaymentCarPatent: appraisal?.patent,
          partPaymentCarPrice: appraisalSimulation?.suggestedPrice ?? null,
          partPaymentCarVersion: appraisal?.version
        }
      : {})
  }
}

// TODO: Half ready for Wigo
export const mapFinancing = ({
  needsFinancing: financing,
  financingSimulation,
  isFinancingPreApproved,
  preApprovedStatus,
  contact: { personalData, personalFinancingData, occupationalData, contactData }
}: BuyProcessStateProps) => {
  if (financing) {
    return {
      financing,
      hasFinancingPreApproved: isFinancingPreApproved,
      preApprovedStatus: preApprovedStatus,
      laborData: false,
      personalData: false,
      ...(financingSimulation && !isObjectEmpty(financingSimulation)
        ? {
            purchaseType: /inteligente/i.test(financingSimulation.purchaseType)
              ? 1
              : 2,
            financingCAE: financingSimulation.annualEquivalency?.toString(),
            financingCreditCardCost:
              financingSimulation.totalCredit?.toString(),
            financingFinalDue:
              financingSimulation.guaranteedFutureValue?.toString(),
            financingNumberOfDues: parseInt(
              financingSimulation.dues as unknown as string
            ),
            financingCreditType: financingSimulation.purchaseType,
            financingInitialPayment:
              financingSimulation.initialPayment?.toString(),
            financingDueValue: financingSimulation.duesValue?.toString()
          }
        : {}),
      ...(!isObjectEmpty(personalFinancingData) &&
      !isObjectEmpty(occupationalData)
        ? {
            laborData: true,
            personalData: true,
            universityStudies: occupationalData.studies,
            laborIncome: Number.parseInt(
              (occupationalData.income as string).replace(/\./g, ''),
              10
            ),
            laborContractType: occupationalData.contractType,
            laborIncomeType: occupationalData.incomeType,
            profession: occupationalData.activity,
            realState: occupationalData.realState,
            laborOld: getLaborOldId(occupationalData.laborOld as string),
            birthDate: formatBuyProcessDate(
              personalFinancingData.birthDate as string
            ),
            contactCommune:
              contactData.commune ??
              `${personalFinancingData.city}, ${personalFinancingData.district}`,
            contactRegion:
              contactData.region ?? personalFinancingData.department,
            contactAddress: `${personalFinancingData.address} ${personalFinancingData.addressNumber}`,
            contactDepartment: personalFinancingData.apartment
          }
        : {})
    }
  }

  return {
    financing: false,
    hasFinancingPreApproved: false,
    personalData: !isObjectEmpty(personalData),
    laborData: false,
    ...(!isObjectEmpty(personalData)
      ? {
          birthDate: formatBuyProcessDate(personalData.birthDate as string),
          contactCommune:
            contactData.commune ??
            `${personalData.city}, ${personalData.district}`,
          contactRegion: contactData.region ?? personalData.department,
          contactAddress: personalData.address,
          contactDepartment: personalData.apartment
        }
      : {})
  }
}

export const BUY_PROCESS_LEAD = 'customer/api/lead/buying-flow'

export const submitBuyRequest = async (
  state: BuyProcessStateProps,
  site: SitesNames,
  token: string
) => {
  const response = await fetchWithoutToken(
    BUY_PROCESS_LEAD,
    site,
    {
      ...mapBaseUser(state),
      ...mapAppraisal(state),
      ...mapFinancing(state)
    },
    'POST',
    toReCaptchaHeader(token)
  )

  if (response.error) throw new Error(response.errorMessage)
  if (response.statusCode === 400) throw new Error(response.message)
}

// TODO: Not ready for Wigo
const mapPreApprovalData: PreApprovalMapFn = (
  {
    car,
    initialPaymentPercentage,
    financingSimulation,
    contact: { contactData, personalFinancingData, occupationalData }
  },
  locations
) => {
  const chile = new Chile(locations as ChileLocation)
  const branch = car?.isNew
    ? car.newCarBranches?.find(
        (branch) => `${branch.name}, ${branch.commune}` === contactData.branchOffice
      )
    : car?.usedCarBranchOffice

  return {
    carId: parseInt(car?.id! ?? '0'),
    purchaseType: /inteligente/i.test(financingSimulation?.purchaseType ?? '')
      ? 1
      : 2,
    initialPayment: initialPaymentPercentage!,
    dues: parseInt((financingSimulation?.dues as unknown as string) ?? '0'),
    clientRut: contactData.rut as string,
    clientMail: contactData.email as string,
    clientPhone: parseInt(
      (contactData.phone as string).replace(/^\+56/, ''),
      10
    ),
    region: (contactData.region as string).length > 20 ? (contactData.region! as string).slice(0,20) : contactData.region! as string,
    regionId: chile.findRegionId(contactData.region as string) ?? 0,
    commune: (contactData.commune as string).length > 20 ? (contactData.commune! as string).slice(0,20) : contactData.commune! as string,
    address: (personalFinancingData.address as string).length > 20 ? (personalFinancingData.address! as string).slice(0,20) : personalFinancingData.address! as string,
    addressNumber: parseInt(personalFinancingData.addressNumber as string, 10),
    salary: parseInt(occupationalData.income as string),
    educationType: optionIdSearch(0, occupationalData.studies as string) ?? 0,
    activityType: optionIdSearch(1, occupationalData.activity as string) ?? 0,
    remunerationType:
      optionIdSearch(3, occupationalData.incomeType as string) ?? 0,
    contractType:
      optionIdSearch(4, occupationalData.contractType as string) ?? 0,
    realEstateType: optionIdSearch(5, occupationalData.realState as string),
    laborOld: getLaborOldId(occupationalData.laborOld as string),
    clientName: contactData.name,
    clientLastname: contactData.lastNames,
    branchOfficeId: car?.isNew ? (parseInt(branch?.id!) ?? 0) : (parseInt(car?.usedCarBranchOffice?.id!) ?? 0)
  }
}

export const PRE_APPROVAL_ENDPOINT = 'customer/api/financial/pre-approbation'

/**
 * @returns if financing is pre approved
 */
export const getPreApprovalResponse = async (
  state: BuyProcessStateProps,
  site: SitesNames,
  locations: Location
) => {
  try {
    if (
      !state.needsFinancing ||
      isObjectEmpty(state.contact.personalFinancingData) ||
      isObjectEmpty(state.contact.occupationalData) ||
      site === SitesNames.WIGO_MOTORS // TODO: Check once financing is enabled
    )
    return {
      isFinancingPreApproved: false,
      preApprovedStatus: ''
    }
  
    const data = mapPreApprovalData(state, locations)
  
    const response: PreApprovalResponse = await fetchWithoutToken(
      PRE_APPROVAL_ENDPOINT,
      site,
      data,
      'POST'
    )
  
    if (response.errorMessage && response.errorMessage !== '') {
      throw new Error(response.errorMessage)
    }
  
    // credinissan validation -> Se elimina debido a nueva validacion utilizando el campo 'status'
    // if (/^OK$/i.test(response.data.description ?? '')) return true

  
    return {
      isFinancingPreApproved: /^pre-aprobado$/i.test(response.data?.status?.toLowerCase() ?? ''),
      preApprovedStatus: response.data?.status ?? ''
    }

  } catch (e) {
    console.log(e)
    return {
      isFinancingPreApproved: false,
      preApprovedStatus: ''
    }
  }
}
