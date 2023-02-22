
export const getVerticalFilterPosition = (type: string) => {
  switch(type) {
    case 'top':
      return '-225px'

    case 'medium-top':
      return '-152.5px'

    case 'center':
      return '-80px'

    case 'medium-bottom':
      return '-10px'

    case 'bottom':
      return '60px'

    default:
      return ''
  }
}
