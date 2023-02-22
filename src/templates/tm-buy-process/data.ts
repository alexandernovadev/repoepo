import { OrForm } from '@gac/core-components'
import { MlHeadingProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-heading/types'
import { FormField } from '@gac/core-components/lib/atomic-components-react/components/UI/organism/or-form/types'
import { ComponentProps } from 'react'
import { BuyProcessCar } from '../../redux/features/buyProcessSlice'
import { siteImportantPrimaryTextClass } from '../../sites/siteClasses'
import { BackgroundContainerColor, SitesNames } from '../../types'
import { Chile } from '../../utils/regions/chile'
import { Peru } from '../../utils/regions/peru'
import {
  ChileLocation,
  Location,
  PeruLocation
} from '../../utils/regions/types'
import { options } from './buy-process/AdditionalData/preApprovalOptions'

export const steps = [
  { label: 'Datos de contacto', index: 1 },
  { label: 'Vehículo en parte de pago', index: 2 },
  { label: 'Simulación de financiamiento', index: 3 },
  { label: 'Pre-aprobación en línea', index: 4 },
  { label: 'Términos y condiciones', index: 5 },
  { label: 'Resumen', index: 6 }
]

export const appraisalTitleHeading = (site: SitesNames): MlHeadingProps => ({
  title: '¿Quieres entregar tu auto en parte de pago?',
  description: 'Puedes obtener una tasación inmediata',
  backgroundColor: BackgroundContainerColor.LIGHT,
  titleClassName: `${siteImportantPrimaryTextClass(site)} text-2xl xl:text-3xl`,
  descriptionClassName: 'text-lg md:text-xl',
  site
})

export const financingTitleHeading = (site: SitesNames): MlHeadingProps => ({
  ...appraisalTitleHeading(site),
  title: '¿Necesitas financiamiento para tu vehículo?',
  description: 'Simula opciones de financiamiento y pre-apruébate en línea'
})

export const confirmationHeading = (site: SitesNames): MlHeadingProps => ({
  ...appraisalTitleHeading(site),
  title: 'Tasación',
  description:
    'Esta tasación considera un auto en buenas condiciones. La oferta será confirmada con la revisión de tu auto.'
})

export const headingFormTitle = (
  needsFinancing: boolean,
  site: SitesNames
): MlHeadingProps => {
  return needsFinancing
    ? {
        ...appraisalTitleHeading(site),
        title: '¡Busca tu pre-aprobación!',
        description:
          'En pocos minutos podemos pre-aprobar el crédito que acabas de simular, solo completa algunos simples datos.'
      }
    : {
        ...appraisalTitleHeading(site),
        title: 'Datos adicionales',
        description:
          'Completa estos datos para continuar con toda tu información'
      }
}

export const appraisalFormHeading = (site: SitesNames): MlHeadingProps => ({
  ...appraisalTitleHeading(site),
  title: 'Obtén la tasación de tu auto en segundos',
  description: 'Tasa tu auto con tu patente o selecciona los datos necesarios'
})

export const mapCarCard = (car: BuyProcessCar) => {
  return {
    brand: car?.brand!,
    name: car?.model!,
    model: car?.version!,
    imageAlt: car?.imageAlt!,
    imageUrl: car?.imageUrl!,
    features: car?.features
  }
}

export const personIdentifier = (site: SitesNames): FormField => {
  if (site === SitesNames.WIGO_MOTORS) {
    return {
      placeholder: 'DNI',
      id: 'dni',
      required: true,
      type: 'raw-number',
      maxLength: 8,
      minLength: 8
    }
  }

  return {
    placeholder: 'RUT',
    id: 'rut',
    required: true,
    type: 'rut'
  }
}
// @ts-expect-error companyId is provided directly to component
export const contactForm: (
  site: SitesNames,
  branchOfficeSolver?: () => Promise<string[]>,
  locations?: Location
) => ComponentProps<typeof OrForm> = (site, branchOfficeSolver, locations) => {
  const baseFields: ComponentProps<typeof OrForm>['fields'] = [
    {
      placeholder: 'Nombre',
      id: 'name',
      required: true,
      type: 'text',
      maxLength: 30
    },
    {
      placeholder: 'Apellidos',
      id: 'lastNames',
      required: true,
      type: 'text',
      maxLength: 30
    },
    personIdentifier(site),
    {
      placeholder: 'Teléfono',
      id: 'phone',
      required: true,
      type: 'phone'
    },
    {
      placeholder: 'Email',
      id: 'email',
      required: true,
      type: 'email',
      maxLength: 80
    },
    ...regionsFields(site, locations!),
    {
      placeholder: '¿Cuando quieres comprar el auto?',
      id: 'buyWindow',
      required: true,
      type: 'select',
      selectParams: {
        options: ['Ahora', 'En 3 meses', 'En 6 meses', 'Más adelante']
      }
    }
  ]

  const branchOfficeField: FormField = {
    placeholder: '¿En que sucursal quieres cotizar tu auto?',
    id: 'branchOffice',
    required: true,
    type: 'select',
    selectParams: {
      resolver: branchOfficeSolver
    }
  }

  return {
    site,
    id: 'contact-data',
    fields: branchOfficeSolver ? [...baseFields, branchOfficeField] : baseFields
  }
}

const regionsFields = (site: SitesNames, locations: Location): FormField[] => {
  if (site === SitesNames.WIGO_MOTORS) {
    const peru = new Peru(locations as PeruLocation)

    return [
      {
        placeholder: 'Departamento',
        id: 'department',
        required: true,
        type: 'select',
        selectParams: {
          resolver: peru.departments
        }
      },
      {
        placeholder: 'Ciudad',
        id: 'city',
        required: true,
        type: 'select',
        selectParams: {
          dependsOn: 'department',
          resolver: peru.findCities
        }
      },
      {
        placeholder: 'Distrito',
        id: 'district',
        required: true,
        type: 'select',
        selectParams: {
          dependsOn: 'city',
          resolver: peru.findDistricts
        }
      }
    ]
  }

  const chile = new Chile(locations as ChileLocation)
  return [
    {
      placeholder: 'Región',
      id: 'region',
      required: true,
      type: 'select',
      selectParams: {
        resolver: chile.regions
      }
    },
    {
      placeholder: 'Comuna',
      id: 'commune',
      required: true,
      type: 'select',
      selectParams: {
        dependsOn: 'region',
        resolver: chile.findCities
      }
    }
  ]
}

const addressField = (isFinancing: boolean): FormField[] =>
  isFinancing
    ? [
        {
          placeholder: 'Calle',
          id: 'address',
          required: true,
          type: 'text',
          maxLength: 50
        },
        {
          placeholder: 'Numeración',
          id: 'addressNumber',
          required: true,
          type: 'raw-number',
          maxLength: 10
        }
      ]
    : [
        {
          placeholder: 'Dirección',
          id: 'address',
          required: true,
          type: 'text',
          maxLength: 50
        }
      ]

export const personalFormTitle = (
  version: string,
  isFinancing: boolean
): string => {
  switch (true) {
    case version === 'v2' && !isFinancing:
      return ''
    case version === 'v2' && isFinancing:
      return 'Datos personales'
    default:
      return 'Datos personales'
  }
}

export const personalForm = (
  site: SitesNames,
  isFinancing: boolean,
  locations: Location, // se ocultan los campos regiones por lo que no se usaran mas las locaciones
  version: string = 'v2'
  ): ComponentProps<typeof OrForm> => {
    // @ts-expect-error companyId is provided directly to component
    return {
      site,
      id: 'personal-data',
      title: personalFormTitle(version, isFinancing),
      fields: [
        {
          id: 'birthDate',
          required: true,
          placeholder: '',
          type: 'date',
          datepickParams: {
            placeholderText: 'Fecha de nacimiento',
            maxDate: new Date(Date.now() - 568036800000), // Current time minus 18 years
            minDate: new Date(1920, 1, 1),
            showMonthDropdown: true,
            showYearDropdown: true,
            dateFormat: 'dd/MM/yyyy',
            showPopperArrow: false
          } as any
        },
        // ...regionsFields(site, locations),
        ...addressField(isFinancing),
        {
          placeholder: 'Departamento (opcional)',
          id: 'apartment',
          required: false,
          type: 'text',
          maxLength: 10
        }
      ]
    }
}

// @ts-expect-error site is provided directly to component
export const laborForm: ComponentProps<typeof OrForm> = {
  id: 'labor-data',
  title: 'Datos laborales',
  fields: [
    {
      placeholder: '¿Cuál es tu nivel de estudios?',
      id: 'studies',
      required: true,
      type: 'select',
      selectParams: {
        options: options[0].options!.map((o) => o.value)
      }
    },
    {
      placeholder: '¿Cuál es tu ocupación actual?',
      id: 'activity',
      required: true,
      type: 'select',
      selectParams: {
        options: options[1].options!.map((o) => o.value)
      }
    },
    {
      placeholder: '¿Cuál es tu antigüedad laboral?',
      id: 'laborOld',
      required: true,
      type: 'select',
      selectParams: {
        options: options[2].options!.map((o) => o.value)
      }
    },
    {
      placeholder: '¿Cuál es tu ingreso mensual?',
      id: 'income',
      required: true,
      type: 'number',
      maxLength: 8
    },
    {
      placeholder: '¿Cuál es tu tipo de ingreso?',
      id: 'incomeType',
      required: true,
      type: 'select',
      selectParams: {
        options: options[3].options!.map((o) => o.value)
      }
    },
    {
      placeholder: '¿Cuál es tu tipo de contrato?',
      id: 'contractType',
      required: true,
      type: 'select',
      selectParams: {
        options: options[4].options!.map((o) => o.value)
      }
    },
    {
      placeholder: '¿Tienes una propiedad?',
      id: 'realState',
      required: false,
      type: 'select',
      selectParams: {
        options: options[5].options!.map((o) => o.value)
      }
    }
  ]
}

export const QueryUrlData = [
  'step=one',
  'step=two',
  'step=three',
  'step=four',
  'step=five',
  'step=success'
]
