import { useEffect, useState, useMemo } from 'react'
import { AtSelectCatalog } from '@gac/core-components'
import { useRouter } from 'next/router'
import { AtSelectCatalogVariants, UseComponentProps } from './types'
import { formatFiltersUsadosResponse, getSelectOptions } from './api'
import { useDispatch, useSelector } from 'react-redux'
import { setCityFilters } from '../../../redux/features/catalogSlice'
import { SelectStoreProps } from '../types'
import { formatCatalogQuery } from '../../../utils/formatQuery'

export const UsadosComponent = ({
  site,
  activeFilters,
  setFilters
}: UseComponentProps) => {
  const dispatch = useDispatch()
  const { query, replace } = useRouter()
  const state = useSelector((state: SelectStoreProps) => state.catalog)
  const [firstOptions, setFirstOptions] = useState([])
  const [secondOptions, setSecondOptions] = useState([])
  const [selectsState, setSelectsState] = useState({
    first: {
      label: state.cityFilter?.label ?? '',
      value: state.cityFilter?.value ?? '',
      id: state.cityFilter?.id ?? ''
    },
    second: {
      label: '',
      value: ''
    }
  })

  useEffect(() => {
    const urlQueryFilters = formatCatalogQuery(query)
    replace(
      `/catalog?page=${state.page}${urlQueryFilters}${
        state.cityFilter.value ? `&city=${state.cityFilter.value}` : ''
      }`,
      undefined,
      {
        shallow: true
      }
    )
  }, [selectsState.first])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      const response = await getSelectOptions({
        endpoint: 'branch-office-city',
        site,
        signal: abortController.signal
      })
      setFirstOptions(formatFiltersUsadosResponse(response, 'city'))
    })()
    return () => abortController.abort()
  }, [])

  useMemo(() => {
    const abortController = new AbortController()
    if (selectsState.first.value) {
      ;(async () => {
        const response = await getSelectOptions({
          endpoint: `branch-office?city=${selectsState.first.value}`,
          site,
          signal: abortController.signal
        })
        setSecondOptions(formatFiltersUsadosResponse(response, 'sucursal'))
      })()
    }
    return () => abortController.abort()
  }, [selectsState])

  return (
    <div className='pt-6 pb-2 w-full h-auto'>
      <span className='text-xs text-gray-600 leading-4 font-normal'>
        Consulta los autos usados que hay en las distintas sucursales
      </span>
      <div>
        <div className='w-full mt-4 flex items-center justify-between'>
          <span className='text-xs text-gray-500 font-normal'>Ciudad</span>
          <AtSelectCatalog
            site={site}
            options={firstOptions}
            onSelect={(option: any) => {
              setSelectsState({ ...selectsState, first: option })
              dispatch(setCityFilters(option)) // guardamos la ciudad en redux en una propiedad diferente ya que no podemos usar los filtros (la ciudad no cambia los filtros de autos)
              if (activeFilters['Sucursal']?.active) {
                setFilters(
                  'Sucursal',
                  false,
                  'City',
                  '',
                  'branchOfficeId',
                  'Usado'
                )
              }
            }}
            variant={AtSelectCatalogVariants.SMALL}
            label='Elige una ciudad'
            selectedValue={state.cityFilter ?? selectsState.first}
            className='w-[180px] flex items-center justify-between'
            optionsClassName='w-[180px] ml-sidebar-select-content'
          />
        </div>
        <div className='w-full mt-4 flex items-center justify-between'>
          <span className='text-xs text-gray-500 font-normal'>Sucursal</span>
          <AtSelectCatalog
            site={site}
            options={secondOptions}
            variant={AtSelectCatalogVariants.SMALL}
            onSelect={(option: any) => {
              // el ultimo parametro es el field del filtro del cuál depende
              setFilters(
                'Sucursal',
                option.value,
                option.label,
                option.id,
                'branchOfficeId',
                'Usado'
              )
              setSelectsState({ ...selectsState, second: option })
            }}
            disabled={selectsState.first.value === ''}
            label='Elige una opción'
            selectedValue={
              activeFilters['Sucursal']?.active
                ? {
                    label: activeFilters['Sucursal']?.label,
                    value: activeFilters['Sucursal']?.value
                  }
                : null
            }
            className='w-[180px] flex items-center justify-between'
            optionsClassName='!w-[230px] ml-sidebar-select-content'
            transitionClassName='right-0'
          />
        </div>
      </div>
    </div>
  )
}
