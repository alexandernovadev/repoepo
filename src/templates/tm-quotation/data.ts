import { BackgroundContainerColor } from '../../types'

export const mapCarLabels: { [key: string]: string } = {
  brand: 'Marca',
  model: 'Modelo',
  version: 'Versión',
  price: 'Precio Lista'
}

export const mapCarTypeProperty = (key: string, isNew: boolean) => {
  if (key === 'price') {
    return isNew ? 'Precio Desde' : mapCarLabels[key]
  }

  if (mapCarLabels[key]) {
    return mapCarLabels[key]
  }

  return key
}

export const mapClientProperty: { [key: string]: string } = {
  name: 'Nombres',
  lastName: 'Apellido',
  rut: 'RUT',
  email: 'e-mail',
  phone: 'Teléfono',
  branch: 'Sucursal',
  comment: 'Comentario'
}

export const mlHeadingData = {
  backgroundColor: BackgroundContainerColor.LIGHT,
  titleClassName: 'text-xl md:text-2xl xl:text-3xl',
  descriptionClassName: 'text-base md:text-xl'
}

export const atLinkData = {
  target: '_self',
  href: '/',
  variant: 'primary-bold',
  label: 'IR AL HOME',
  className: 'my-2 mx-6 text-xs'
}
