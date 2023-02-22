/** Format a RUT with dots and a dash, does not do validation, expects a valid value */
export const formatRut = (rut: string) => {
  if (rut.length <= 1) return rut

  const cleaned = rut.replace(/\.|-/g, '')
  const dv = rut.slice(-1).toUpperCase()
  const formatted = Number.parseInt(cleaned.slice(0, -1)).toLocaleString(
    'es-CL'
  )
  return `${formatted}-${dv}`
}
