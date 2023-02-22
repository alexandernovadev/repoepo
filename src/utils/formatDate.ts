export const formatDate = (date: Date) => {
  return date.toLocaleDateString('es')
}

export const formatToSentDate = (date: string): string => {
  return date.split('/').reverse().join('-')
}
