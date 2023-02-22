import { queryBuyProcessProps } from '../../hooks/useOverrideStepQuery'
import { BuyProcessCar } from '../../redux/features/buyProcessSlice'

export const formatBuyProcessUrl = (car: BuyProcessCar, query: queryBuyProcessProps) => {
  const queryParams = {
    tipo: car.isNew ? 'NUEVO' : 'USADO',
    categoria: car.category ?? '',
    marca: car.brand ?? '',
    modelo: car.model ?? '',
    utm_source: query.utm_source ?? '',
    utm_medium: query.utm_medium ?? '',
    utm_campaign: query.utm_campaign ?? '',
    utm_term: query.utm_term ?? '',
    utm_content:query.utm_content ?? '',
    utm_id:query.utm_id ?? ''
  }

  const depuredQueryParams = Object.entries(queryParams)?.filter((key) => key[1] !== '')

  return new URLSearchParams(depuredQueryParams).toString() + '&'
}