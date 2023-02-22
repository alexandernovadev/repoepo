import { Sites } from '../../../../types'
import { getTextColorForSite } from './classes'

interface CarsInfoProps extends Sites {
  info: {
    label: string
    value: string | undefined
  }[]
}

export const CarsInfo = ({ info, site }: CarsInfoProps) => {
  return (
    <div className='p-4 border-solid border border-gray-200 box-border rounded-lg text-sm'>
      {info.map((detail, index) => {
        if (!detail.value) return null
        return (
          <div
            className={`flex items-center justify-between ${
              index > 0 ? 'mt-2' : ''
            }`}
            key={index}
          >
            <label className='text-gray-400 font-normal'>{detail.label}</label>
            <span className={`${getTextColorForSite(site)} font-medium`}>
              {detail.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
