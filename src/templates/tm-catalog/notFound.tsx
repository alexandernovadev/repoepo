import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setPage } from '../../redux/features/catalogSlice'
import { AtButton, MlHeading } from '@gac/core-components'
import { renderSlider } from '../../components/Slider/renderSlider'
import { NotFoundProps } from './types'
import { NotFoundClasses } from './classes'
import { BackgroundContainerColor } from '../../types/contentful/content-model/or-container'

export const NotFound: React.FC<NotFoundProps> = ({
  setInitialFilters,
  setQueryFilters,
  site
}: NotFoundProps) => {
  const dispatch = useDispatch()
  const { replace } = useRouter()

  return (
    <div className={NotFoundClasses.container}>
      <h2 className={NotFoundClasses.title}>
        Lo sentimos, esta búsqueda no tiene resultados
      </h2>
      <p className={NotFoundClasses.description}>
        Intenta editando los filtros
      </p>
      <AtButton
        site={site}
        label='BORRAR TODOS LOS FILTROS'
        className={NotFoundClasses.button}
        onClick={() => {
          setInitialFilters({})
          setQueryFilters({})
          dispatch(setPage(1))
          replace(`/catalog?page=${1}`, undefined, {
            shallow: true
          })
        }}
      />
      <div className={NotFoundClasses.separator} />
      <MlHeading
        site={site}
        backgroundColor={BackgroundContainerColor.LIGHT}
        title='Los más vistos'
        description='Conoce los últimos autos que ya están disponibles'
      />
      {renderSlider('moreViewsSmall', [], false, site)}
    </div>
  )
}
