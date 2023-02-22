import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { OrHomeBanner } from '@gac/core-components'
import { useDispatch } from 'react-redux'
import {
  fetchInitData,
  fetchOnSelectChange,
  formatQuery
} from '../../utils/home-filter'
import { option as filterOption } from '@gac/core-components/lib/@types/common'
import { setFilters } from '../../redux/features/catalogSlice'
import { HomeBannerProps } from './types'
import { useHomeBanner } from '../../hooks/useHomeBanner'
import { getVerticalFilterPosition } from './getVerticalFilterPosition'

export const HomeBanner = ({
  bgImageDesktop,
  bgImageMobile,
  title,
  showFilter,
  buttonLabel,
  activeFilters,
  isH1,
  moveFilterInVertical,
  site
}: HomeBannerProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const { state, setState, selectFilter, options, setOptions } =
    useHomeBanner(activeFilters)

  const getInitialFilterData = async () => {
    try {
      const { total, formattedOptions } = await fetchInitData(
        site,
        selectFilter
      )
      setTotal(total)
      setOptions(formattedOptions)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInitialFilterData()
  }, [])

  const handleFilterChange = async (
    option: filterOption | null,
    name: string
  ) => {
    setLoading(true)
    const newState = { ...state, [name]: option }

    try {
      const { formattedOptions, total, validState } = await fetchOnSelectChange(
        newState,
        options,
        name,
        site,
        selectFilter
      )
      setState(validState)
      setOptions(formattedOptions)
      setTotal(total)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const handleFilterSearch = async () => {
    try {
      const query = formatQuery(state, [], selectFilter)
      dispatch(setFilters({}))
      router.push(`/catalog${query}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <OrHomeBanner
      site={site}
      state={state}
      bgImageDesktop={bgImageDesktop.file.url}
      bgImageMobile={bgImageMobile.file.url}
      title={title}
      showFilter={showFilter}
      buttonLabel={buttonLabel}
      isH1={isH1}
      onFilterChange={handleFilterChange}
      onFilterSearch={handleFilterSearch}
      total={total}
      filterOptions={options}
      loading={loading}
      moveFilterInVertical={{
        moveFilter: !(moveFilterInVertical === 'none'),
        verticalAlign: getVerticalFilterPosition(moveFilterInVertical)
      }}
    />
  )
}
