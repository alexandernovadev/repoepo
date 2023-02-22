import { MlCardFeature } from '@gac/core-components'
import React from 'react'
import { Sites } from '../../../types'
import { UsedClasses } from './classes'
import { Feature } from './types'

export interface EquipmentProps extends Sites {
  title?: string
  features: Feature[]
}

export const Features: React.FC<EquipmentProps> = ({
  title = 'Características',
  features,
  site
}: EquipmentProps) => {
  return (
    <div className={UsedClasses.features.container}>
      <h2 className={UsedClasses.features.title}>{title}</h2>
      <div className={UsedClasses.features.content}>
        {features.map((item) => {
          if (!item) return null
          return (
            <MlCardFeature
              id={item.title}
              disabled={false}
              site={site}
              className='flex-1'
              valueClassName='lowercase first-letter:uppercase'
              title={item.title}
              key={item.title}
              value={item.value}
              icon={item.icon}
            />
          )
        })}
      </div>
    </div>
  )
}
