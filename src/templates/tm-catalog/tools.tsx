import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconColumn } from './icons'
import { SelectStoreProps, ToolsProps } from './types'
import { AtSelectCatalog, MlSidebarFilter } from '@gac/core-components'
import { defaultOptions, resetOptions } from './mock'
import { ToolsClasses } from './classes'
import { useRouter } from 'next/router'
import { sidebarFiltersComponents } from './filtersComponent'
import { setCityFilters } from '../../redux/features/catalogSlice'

export const Tools: React.FC<ToolsProps> = ({
  setColumns,
  columns,
  setInitialFilters,
  sideBarOptions,
  site,
  setSort,
  sort,
  companyId
}: ToolsProps) => {
  const dispatch = useDispatch()
  const { query } = useRouter()
  const totalCars = useSelector(
    (state: SelectStoreProps) => state.catalog.params?.total
  )
  const filters = useSelector(
    (state: SelectStoreProps) => state.catalog.filters
  )
  const params = useSelector((state: SelectStoreProps) => state.catalog.params)

  return (
    <div className={ToolsClasses.container}>
      <label className={ToolsClasses.labelCars}>
        {parseInt(query?.page as string) > params?.pages ? '0' : totalCars}{' '}
        vehículos
      </label>

      <MlSidebarFilter
        site={site}
        title='Filtros'
        numberCarsFilter={totalCars}
        dataFilters={sideBarOptions}
        activeFilters={{ ...filters }}
        setActiveFilters={setInitialFilters}
        className={ToolsClasses.sidebar}
        api={process.env.NEXT_PUBLIC_API_URL ?? ''}
        sidebarFiltersComponents={sidebarFiltersComponents}
        companyId={companyId}
        cleanExternalFilters={() => {
          dispatch(
            setCityFilters({
              label: '',
              value: '',
              id: ''
            })
          )
        }}
      />

      <div className='flex items-center'>
        <AtSelectCatalog
          site={site}
          label='Seleccionar'
          options={sort === 0 ? defaultOptions : resetOptions}
          onSelect={(option: any) => {
            setSort(parseInt(option?.value))
          }}
          containerClass={ToolsClasses.selectContainer}
          className={ToolsClasses.select}
          optionsClassName={ToolsClasses.selectChildren}
          optionLabelClassName='normal-case'
          selectedValue={resetOptions[sort]}
        />

        <button
          className={`${ToolsClasses.button}`}
          onClick={() => setColumns(columns === 3 ? 2 : 3)}
          aria-label='Cambiar vista de la grilla'
        >
          {IconColumn(columns, site)}
        </button>
      </div>
    </div>
  )
}
