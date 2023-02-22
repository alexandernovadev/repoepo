import {
  MlVehicleColors,
  MlRichText,
  MlRichTextVariant
} from '@gac/core-components'
import React, { useState } from 'react'
import { CommonClasses } from '../../classes'
import { VehicleColorsProps } from '../types'
import { VehicleColorsClasses } from './classes'

export const VehicleColors: React.FC<VehicleColorsProps> = ({
  description,
  title,
  site,
  car,
  colors = [],
  images
}: VehicleColorsProps) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.label ?? '')

  const onColorClick = (color: string) => {
    setSelectedColor(color)
  }

  const carImg = {
    ...images,
    name: car.detailModel
  }

  return (
    <div
      className={`${VehicleColorsClasses.containerMargin} ${CommonClasses.sectionContainer}`}
    >
      <div className={VehicleColorsClasses.grid}>
        <div className={VehicleColorsClasses.bg}>
          <h2 className={VehicleColorsClasses.title}>{title}</h2>
          <MlRichText
            site={site}
            variant={MlRichTextVariant.CERTIFICATE_CAR}
            text={description!}
          />
        </div>
        <div className='flex items-center justify-center'>
          <MlVehicleColors
            site={site}
            images={carImg}
            colors={colors}
            onColorClick={onColorClick}
            selectedColor={selectedColor}
          />
        </div>
      </div>
    </div>
  )
}
