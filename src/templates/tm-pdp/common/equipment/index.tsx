import { MlFeatureList } from '@gac/core-components'
import React from 'react'
import { CommonClasses } from '../../classes'
import { EquipmentProps } from '../types'
import { Classes } from './classes'

export const Equipment: React.FC<EquipmentProps> = ({
  equipments,
  title = 'Equipamiento',
  backgroundColor = 'white',
  description,
  site,
  isNew
}: EquipmentProps) => {
  const bg = backgroundColor === 'white' ? 'bg-white' : 'bg-gac-main-01'

  return (
    <div
      className={`${Classes.containerMargin} ${CommonClasses.sectionContainer}`}
    >
      <div className={`${bg} ${Classes.bg}`}>
        {equipments && (
          <>
            <h2 className={Classes.title}>{title}</h2>
            <div className={Classes.grid}>
              {equipments.map((group, idx) => (
                <MlFeatureList key={idx} features={group} site={site} />
              ))}
            </div>
          </>
        )}

        {description && !isNew && (
          <div className='p-4 mt-4 md:py-6 md:px-16 lg:px-20'>
            <p className='text-gray-600 break-words'>{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
