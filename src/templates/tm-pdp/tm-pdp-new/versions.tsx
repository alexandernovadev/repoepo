import {
  MlCardCarVersion,
  MlHeading,
  OrSwiperSlider
} from '@gac/core-components'
import { BackgroundContainerColor, SliderTypeClasses } from '../../../types'
import { VersionsProps } from './types'

export const Versions = ({
  title = 'Selecciona una versión',
  description,
  versions,
  selectedVersion,
  handleVersionClick,
  site
}: VersionsProps) => {
  return (
    <>
      <MlHeading
        title={title}
        description={description}
        backgroundColor={BackgroundContainerColor.WHITE}
        site={site}
      />
      <OrSwiperSlider
        type={SliderTypeClasses.VERSIONS}
        site={site}
        loop={false}
      >
        {versions.map((item, idx) => (
          <MlCardCarVersion
            onClick={handleVersionClick}
            selected={selectedVersion === item.id}
            key={idx}
            {...item}
            site={site}
          />
        ))}
      </OrSwiperSlider>
    </>
  )
}
