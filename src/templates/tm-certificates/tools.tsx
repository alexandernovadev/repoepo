import React from 'react'
import { AtSelectCatalog } from '@gac/core-components'
import { IconColumn } from '../tm-catalog/icons'
import { defaultOptions, resetOptions } from '../tm-catalog/mock'
import { ToolsClasses } from './classes'
import { CerticatesState, ToolsProps } from './types'
import { useSelector } from 'react-redux'

export const Tools = ({
  setColumns,
  columns,
  site,
  sort,
  setSort
}: ToolsProps) => {
  const totalCars = useSelector(
    (state: CerticatesState) => state.certificates.params.total
  )
  return (
    <div className={ToolsClasses.container}>
      <label className={ToolsClasses.labelCars}>{totalCars} vehículos</label>

      <div className='flex items-center'>
        <label className={ToolsClasses.labelSort}>Ordenar por</label>
        <AtSelectCatalog
          site={site}
          label='Agregados recientemente'
          options={sort === 0 ? defaultOptions : resetOptions}
          onSelect={(option: any) => {
            setSort(parseInt(option?.value))
          }}
          className={ToolsClasses.select}
          optionsClassName={ToolsClasses.selectChildren}
          selectedValue={resetOptions[sort]}
        />

        <button
          className={`${ToolsClasses.button}`}
          onClick={() => setColumns(columns === 3 ? 2 : 3)}
          aria-label='Cambiar vista de la grilla'
        >
          {IconColumn(columns)}
        </button>
      </div>
    </div>
  )
}
