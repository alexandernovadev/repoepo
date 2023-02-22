export const toCapitalize = (string: string): string => {
  if (string) {
    const lowerString = string?.toLowerCase()
    const words = lowerString?.split(' ').filter((str) => str.trim())
    return words
      .map((word) => {
        return word[0]?.toUpperCase() + word?.substring(1)
      })
      .join(' ')
  }
  return ''
}
