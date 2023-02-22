import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
  setParams,
  setCars,
  setLoading,
  setPage,
  setFilters,
  setCityFilters
} from '../../redux/features/catalogSlice'
import { NotFound } from './notFound'
import { CarsGrid } from './cars'
import { Information } from './informationBanner/information'
import { MlSkeletonVariants, SelectStoreProps, TmCatalogProps } from './types'
import { defaultPath } from './mock'
import {
  ContainerCardsClasses,
  ContainerClasses,
  SideBarClasses,
  TmCatalogClasses
} from './classes'
import { fetchWithoutToken } from '../../utils/fetch'
import { Tools } from './tools'
import { MlSidebarFilter, MlBreadcrumb, MlSkeleton } from '@gac/core-components'
import { formatCatalogQuery } from '../../utils/formatQuery'
import { addSidebarFilters, formatSidebarData } from './formatFilters'
import useShowChat from '../../hooks/useShowChat'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { areSidebarFiltersRefresh } from './filtersDependencies'
import { sidebarFiltersComponents } from './filtersComponent'
import { getCompanyRequestHeader } from '../../utils/sites'
import { SitesNames } from '../../types'

export const TmCatalog: React.FC<TmCatalogProps> = ({
  template,
  site
}: TmCatalogProps) => {
  const dispatch = useDispatch()
  const skeletonArray = new Array(13).fill('')
  const { companyId } = getCompanyRequestHeader(site)
  const state = useSelector((state: SelectStoreProps) => state.catalog)
  const { query, replace } = useRouter()
  const { page, params, filters, cars, loading } = state
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [updateSidebarFilters, setUpdateSidebarFilters] = useState(false)
  const [saveDependsFilters, setSaveDependsFilters] = useState<Array<string>>(
    []
  )
  const [sort, setSort] = useState<number>(0)
  const [filtersCount, setFiltersCount] = useState()
  const [columns, setColumns] = useState(3)
  const [sideBarOptions, setSideBarOptions] = useState<any>()
  const [initialFilters, setInitialFilters] = useState<any>(
    JSON.parse(JSON.stringify(filters)) || {}
  )
  const [gubagooChat, setGubagooChat] = useState<boolean>(site === 'WI')
  const [queryFilters, setQueryFilters] = useState<any>({
    brandId: query?.brandId,
    categoryId: query?.categoryId,
    modelId: query?.modelId,
    typeId: query?.typeId,
    listPrice: query?.listPrice,
    year: query?.year,
    mileage: query?.mileage,
    fuelId: query?.fuelId,
    colorId: query?.colorId,
    tractionId: query?.tractionId,
    doorsId: query?.doorsId,
    seatsId: query?.seatsId,
    transmissionId: query?.transmissionId,
    branchOfficeId: query?.branchOfficeId,
    city: query?.city
  })

  const utmParams = useMemo(() => {
    const params = {
      utm_source: (query?.utm_source as string) ?? '',
      utm_medium: (query?.utm_medium as string) ?? '',
      utm_campaign: (query?.utm_campaign as string) ?? '',
      utm_term: (query?.utm_term as string) ?? '',
      utm_content: (query?.utm_content as string) ?? '',
      utm_id: (query?.utm_id as string) ?? ''
    }

    let prop: keyof typeof params

    for (prop in params) {
      if (params[prop] === '') {
        delete params[prop]
      }
    }

    const stringParams = `&${new URLSearchParams(params).toString()}`

    return stringParams === '&' ? '' : stringParams
  }, [])

  const [isUsedFilterActive, setIsUsedActiveFilter] = useState<boolean>(false)

  useShowChat(
    gubagooChat ||
      (isUsedFilterActive && template?.showChatToUsedCars) ||
      (site === SitesNames.PORTILLO &&
        queryFilters?.typeId?.includes('1') &&
        !queryFilters.typeId.includes('2')), // Unicamente para Portillo -> activamos gubagoo con el filtro nuevos
    site
  )

  const newSidebarData = async (finalUrlQuery: string) => {
    setInitialLoading(true)
    const options = await formatSidebarData(
      finalUrlQuery,
      site,
      template!.priceRange
    )
    let objectFilters: any = {}
    let arrayFilters: any = []
    options?.forEach((options: any) => {
      let entries = Object.entries(options)[0]
      objectFilters[entries[0]] = entries[1]
    })
    Object.entries(objectFilters)?.forEach(([, value]) => {
      arrayFilters.push(value) // el sidebar necesita un array para renderizar la inf por eso se transforma el objeto a un Array
    })

    setFiltersCount(options.length)
    setSideBarOptions(arrayFilters)
    setInitialLoading(false)

    return objectFilters
  }

  useEffect(() => {
    ;(async () => {
      const objectFilters = await newSidebarData('')
      // verificamos si hay filtros activos por url o guardados en cache para pintarlos en el sidebar inicialmente
      const newQueryFilters = await addSidebarFilters(
        queryFilters,
        objectFilters,
        site
      )
      if (queryFilters.city) {
        dispatch(
          setCityFilters({
            label: queryFilters.city,
            value: queryFilters.city
          })
        )
      }
      if (Object.keys(newQueryFilters).length > 0) {
        setInitialFilters(newQueryFilters)
      } else {
        // setInitialFilters(JSON.parse(JSON.stringify(filters)) || {})
        setInitialFilters({})
        setQueryFilters({})
      }
      // actualizamos la bandera para indicar que ya se hizo el primer render y poder habilitar el memo
      setUpdateSidebarFilters(true)
    })()
    if (!query?.page && page !== 1) {
      dispatch(setPage(1))
    } else if (query?.page) {
      dispatch(setPage(parseInt(query?.page as string)))
    }
  }, [])

  // Memo que se encarga de revisar los filtros para actualizar su contenido dependiendo de ciertos filtros dependientes
  useMemo(() => {
    if (updateSidebarFilters) {
      // verificamos que no se ejecute si la pagina carga inicialmente (firstRender)
      // buscamos que dentro de los filtros se encuentren los filtros condiciones (nuevos) los otros filtros seran dependientes de estos
      const { areDependsFilters, getActiveFilters, finalUrlQuery } =
        areSidebarFiltersRefresh(
          queryFilters,
          JSON.parse(JSON.stringify(filters)),
          saveDependsFilters
        )
      setSaveDependsFilters(getActiveFilters)
      if (areDependsFilters) {
        // si dentro de los filtros tenemos nuevos actualizamos la data raiz del sidebar
        newSidebarData(finalUrlQuery)
        // si ya seleccionamos los filtros al eliminarlos la primera condicion no se cumplira porque los filtros ya no existen por lo que esta bandera nos permite volver a entrar a la condicion y limpiar la raiz de filtros cuando quitemos alguno de los dependientes y volver a la informacion por default del sidebar
      }
    }
  }, [filters])

  const onInitialFilterChange = (filtros: any) => {
    if (Object.keys(filtros).length <= 0) setQueryFilters({})
    setInitialFilters(filtros)
    dispatch(setPage(1))
  }

  useEffect(() => {
    let filtersCopy: any = {}
    let finalQuery: any = {}

    if (Object.keys(initialFilters).length > 0) {
      Object.entries(initialFilters)
        ?.filter(([, value]: any) => value?.active)
        ?.forEach(([key, value]) => {
          Object.defineProperty(initialFilters, key, {
            writable: true,
            configurable: true
          })
          filtersCopy[key] = value
        })
      Object.keys(filtersCopy)?.forEach((filter: any) => {
        if (filtersCopy[filter].query in finalQuery) {
          finalQuery = {
            ...finalQuery,
            [filtersCopy[filter].query]: [
              ...finalQuery[filtersCopy[filter].query],
              filtersCopy[filter].id
            ]
          }
        } else {
          finalQuery = {
            ...finalQuery,
            [filtersCopy[filter].query]: [filtersCopy[filter].id]
          }
        }
      })
      setQueryFilters(finalQuery)
    }
    dispatch(setFilters(filtersCopy))
  }, [initialFilters])

  useEffect(() => {
    if (queryFilters.typeId !== undefined) {
      setIsUsedActiveFilter(queryFilters.typeId.includes('2'))
    } else if (!queryFilters.typeId) {
      setIsUsedActiveFilter(false)
    }

    const abortController = new AbortController()
    fetchCarsFilters(abortController.signal)
    return () => abortController.abort()
  }, [page, queryFilters, sort])

  const fetchCarsFilters = async (signal: AbortSignal) => {
    dispatch(setLoading(true))
    const urlFilters = formatCatalogQuery(queryFilters)
    const urlQuery = `?take=12&page=${page}&sort=${sort}${urlFilters}`
    replace(
      `/catalog?page=${page}${urlFilters}${
        state.cityFilter.value && initialFilters['Usado']
          ? `&city=${state.cityFilter.value}`
          : ''
      }${utmParams}`,
      undefined,
      {
        shallow: true
      }
    )
    try {
      const results = await fetchWithoutToken(
        `catalog/api/car/filter${urlQuery}`,
        site,
        undefined,
        'GET',
        {},
        signal
      )
      if (site !== 'WI') setGubagooChat(results?.params?.gubagooChat)
      dispatch(setParams(results?.params))
      dispatch(setCars(results.result))
      dispatch(setLoading(false))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dispatch(setLoading(false))
      console.error(error)
    }
  }

  return (
    <div className={`${TmCatalogClasses} min-h-[50vh]`}>
      <div className='mb-8'>
        <MlBreadcrumb site={site} path={defaultPath} />
      </div>

      <ClientSideOnly>
        <div className={`${ContainerClasses}`}>
          <div className={`${SideBarClasses}`}>
            {initialLoading ? (
              <MlSkeleton
                site={site}
                variant={MlSkeletonVariants.ML_SIDEBAR_FILTER}
                filters={filtersCount || 9}
              />
            ) : (
              <MlSidebarFilter
                site={site}
                title='Filtros'
                numberCarsFilter={params?.total}
                dataFilters={sideBarOptions}
                activeFilters={{ ...initialFilters }}
                setActiveFilters={onInitialFilterChange}
                api={process.env.NEXT_PUBLIC_API_URL ?? ''}
                sidebarFiltersComponents={sidebarFiltersComponents}
                companyId={companyId.toString()}
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
            )}
          </div>

          <div className='w-full min-w-0'>
            <Information template={template} site={site} />
            <div className='mt-0.5 mb-4 w-full'>
              <Tools
                site={site}
                setColumns={setColumns}
                columns={columns}
                setInitialFilters={onInitialFilterChange}
                sideBarOptions={sideBarOptions}
                setSort={setSort}
                sort={sort}
                companyId={companyId.toString()}
              />
              {loading || initialLoading ? (
                <div
                  className={`
                    ${ContainerCardsClasses}
                    ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}
                    mt-20
                  `}
                >
                  {skeletonArray?.map((_, index: number) => (
                    <MlSkeleton
                      site={site}
                      key={index}
                      variant={MlSkeletonVariants.ML_CARD_PRODUCT}
                    />
                  ))}
                </div>
              ) : cars?.length <= 0 ||
                parseInt(query?.page as string) > params?.pages ? (
                <NotFound
                  site={site}
                  setInitialFilters={setInitialFilters}
                  setQueryFilters={setQueryFilters}
                />
              ) : (
                <CarsGrid site={site} columns={columns} />
              )}
            </div>
          </div>
        </div>
      </ClientSideOnly>
    </div>
  )
}
