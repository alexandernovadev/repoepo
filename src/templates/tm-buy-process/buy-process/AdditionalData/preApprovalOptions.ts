type OccupationalOptions = {
  label: string
  key: string
  isOptional?: boolean
  options?: { value: string; id: number }[]
}[]

export const options: OccupationalOptions = [
  {
    label: 'Estudios',
    key: 'studies',
    options: [
      { value: 'Básica', id: 1 },
      { value: 'Media', id: 2 },
      { value: 'Superior', id: 3 },
      { value: 'Otro', id: 4 }
    ]
  },
  {
    label: 'Actividad',
    key: 'activity',
    options: [
      { value: 'Dependiente', id: 6 },
      { value: 'Independiente (Honorario)', id: 2 },
      { value: 'Independiente con contrato de arrendamiento de servicios', id: 3},
      { value: 'Ingresos por retiros en sociedad', id: 4 },
      { value: 'Jubilado', id: 1 },
      { value: 'Otro', id: 5 }
    ]
  },
  {
    label: '¿Cuál es tu antigüedad laboral?',
    key: 'laborOld',
    options: [
      { value: 'Menor a seis meses', id: 1 },
      { value: 'Mayor a siete meses', id: 2 },
      { value: 'Mayor a dos años', id: 3 }
    ]
  },
  {
    label: 'Tipo de ingresos',
    key: 'incomeType',
    options: [
      { value: 'Sueldo fijo mensual', id: 1 },
      { value: 'Sueldo variable mensual', id: 2 }
    ]
  },
  {
    label: '¿Cuál es tu tipo de contrato?',
    key: 'contractType',
    options: [
      { value: 'Contrato indefinido ', id: 1 },
      { value: 'Contrato a plazo fijo', id: 2 }
    ]
  },
  {
    label: 'Posee bien raíz',
    key: 'realState',
    isOptional: true,
    options: [
      { value: 'No', id: 2 },
      { value: 'Sí, tengo una casa', id: 1 },
      { value: 'Sí, tengo un terreno', id: 3 },
      { value: 'Sí, tengo una oficina', id: 4 },
      { value: 'Sí, tengo un departamento', id: 5 },
      { value: 'Sí, tengo un fundo', id: 6 },
      { value: 'Sí, tengo una parcela', id: 7 },
      { value: 'Sí, tengo una propiedad comercial', id: 8 },
      { value: 'Sí, tengo una propiedad industrial', id: 9 },
      { value: 'Otro', id: 2 }
    ]
  }
]

export const optionIdSearch = (key: number, value: string) =>
  options[key]?.options?.find((option) => option.value === value)?.id
