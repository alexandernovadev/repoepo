import { MlHorizontal, OrSwiperSlider } from '@gac/core-components'
import React from 'react'
import { SliderTypeClasses } from '../../../../types'
import { CardsSectionProps } from '../types'
import { Classes } from './classes'

export const CardsSection: React.FC<CardsSectionProps> = ({
  blocks,
  title = 'Todo lo que necesitas saber',
  site
}: CardsSectionProps) => {
  return (
    <div className={Classes.container}>
      <h2 className={Classes.title}>{title}</h2>
      <div className={Classes.containerDesktop}>
        {blocks?.map((item, idx) => (
          <MlHorizontal {...item} key={idx} site={site} />
        ))}
      </div>
      <div className={Classes.containerMobile}>
        <OrSwiperSlider type={SliderTypeClasses.PERKS} site={site}>
          {blocks?.map((item, idx) => (
            <MlHorizontal {...item} key={idx} site={site} />
          ))}
        </OrSwiperSlider>
      </div>
    </div>
  )
}
