export const formatNumberToLocale = (value: any, feature?: string) => {
  let result = ''

  if (typeof value === 'string') {
    result = parseInt(value).toLocaleString('es-CL')
  } else if (typeof value === 'number') {
    result = Math.round(value).toLocaleString('es-CL')
  }

  if (feature === 'mileage') {
    result += ' km'
  } else if (feature === 'displacement') {
    result += ' cc'
  }

  return result
}
