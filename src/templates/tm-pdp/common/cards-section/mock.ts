import { MlHorizontalVariant } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-horizontal/types'

const image = {
  title: 'Financiamiento',
  description: '',
  file: {
    url: 'https://images.ctfassets.net/6rgkmnd309z8/4Gux1huaXApumFMaoon89R/f54fea900d4eb008c3b3e2fe7eae0587/Financiamiento.svg',
    details: {
      size: 99999,
      image: {
        width: 99999,
        height: 99999
      }
    }
  }
}

const variant = 'default' as MlHorizontalVariant

export const blocks = [
  {
    variant,
    title: 'Financiamiento',
    description:
      'Te ofrecemos las mejores opciones para financiar tu nuevo vehículo.',
    image
  },
  {
    variant,
    title: 'Tu vehículo en parte de pago',
    description:
      'Olvídate del trámite de vender tu auto, lo recibimos y abonamos a tu compra.',
    image
  },
  {
    variant,
    title: 'Seguros',
    description:
      'Te asesoramos para elegir el seguro que mejor se ajuste a tus necesidades.',
    image
  },
  {
    variant,
    title: 'Mantenciones prepagadas',
    description:
      'Agrega las mantenciones a tu crédito, asegura el precio y págalo en cuotas.',
    image
  },
  {
    variant,
    title: 'Garantía extendida',
    description:
      'Protege tu vehículo con una cobertura adicional y evita gastos imprevistos.',
    image
  },
  {
    variant,
    title: 'Accesorios',
    description: 'Todo lo que necesitas para complementar tu vehículo.',
    image
  }
]
