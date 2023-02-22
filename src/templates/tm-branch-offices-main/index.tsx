import {
  AtLink,
  AtSelectCatalog,
  AtSelectCatalogVariants,
  MlBranchesSidebar,
  MlBreadcrumb,
  MlHeading,
  MlHorizontal,
  MlHorizontalVariant,
  MlSkeleton
} from '@gac/core-components'
import { MlCardBranchProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-cardBranch/types'
import { Wrapper } from '@googlemaps/react-wrapper'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { MapComponent, Marker, render } from '../../components/Map'
import {
  AtLinkVariants,
  BackgroundContainerColor,
  SitesNames
} from '../../types'
import { MlSkeletonVariants } from '../tm-catalog/types'
import { buildSchedule, buildSections } from './api'
import { getNotFoundTextClasses, TmBranchOfficesMainClasses } from './classes'
import { breadcrumbPath } from './data'
import { useBranchOffices } from './hooks/useBranchOffices'
import { useBranchOfficesData } from './hooks/useBranchOfficesData'
import {
  Brand,
  DataType,
  SelectOption,
  TmBranchOfficesMainProps
} from './types'

export const TmBranchOfficesMain = ({
  site,
  template: {
    supportPhoneNumber,
    supportUrl,
    enableBrandsBy,
    notFoundImage,
    supportMobilePhone
  }
}: TmBranchOfficesMainProps) => {
  const [selectedBranchOffice, setSelectedBranchOffice] = useState(
    null as number | null
  )

  const [selectedService, setSelectedService] = useState(
    null as SelectOption | null
  )
  const [selectedBrand, setSelectedBrand] = useState(
    null as SelectOption | null
  )
  const [selectedCity, setSelectedCity] = useState(null as SelectOption | null)

  const [map, setMap] = useState(null as google.maps.Map | null)

  const skeletonArray = new Array(5).fill('')

  const [markersUbication, setMarkersUbication] = useState<
    Array<{ latitud: number; longitud: number }>
  >([])

  const [branchOfficesData, setBranchOfficesData, loadingBranchOffices] =
    useBranchOffices({
      site,
      city: selectedCity?.value ?? null,
      service: selectedService?.value ?? null,
      brand: selectedBrand?.value ?? null
    })

  const [services, loadingServices] = useBranchOfficesData({
    site,
    data: DataType.SERVICES,
    city: selectedCity?.value ?? null,
    service: selectedService?.value ?? null,
    brand: selectedBrand?.value ?? null
  })

  const [cities, loadingCities] = useBranchOfficesData({
    site,
    data: DataType.CITIES,
    city: selectedCity?.value ?? null,
    service: selectedService?.value ?? null,
    brand: selectedBrand?.value ?? null
  })

  const [brands, loadingBrands] = useBranchOfficesData({
    site,
    data: DataType.BRANDS,
    city: selectedCity?.value ?? null,
    service: selectedService?.value ?? null,
    brand: selectedBrand?.value ?? null
  })

  const openBranchOffice = (markerId: number) => {
    let selectBranchData: Array<any> = []
    branchOfficesData.forEach((branch, index) => {
      if (branch.id === markerId.toString()) {
        const newBranchOffices = branchOfficesData.filter(
          (_, findBrand) => index !== findBrand
        )
        selectBranchData = [branch, ...newBranchOffices]
      }
    })
    if (selectBranchData.length > 0) {
      setBranchOfficesData(selectBranchData)
      setSelectedBranchOffice(0)
      map?.panTo({
        lat: selectBranchData[0].latitude,
        lng: selectBranchData[0].longitude
      })
      map?.setZoom(18)
    }
  }

  const branchOfficeCards = useMemo((): MlCardBranchProps[] => {
    return branchOfficesData?.map((branchOffice, index) => {
      let parsedBrands: Array<Brand> = []

      // Si incluye el atributo leadCenterCodeUsed se agrega la marca usados a los brands
      if (branchOffice.leadCenterCodeUsed) {
        if (branchOffice.brands) {
          parsedBrands = [
            {
              id: 0,
              slug: 'usados',
              value: 'USADOS'
            },
            ...branchOffice.brands
          ]
        } else {
          parsedBrands = [
            {
              id: 0,
              slug: 'usados',
              value: 'USADOS'
            }
          ]
        }
      } else if (branchOffice.brands) {
        parsedBrands = [...branchOffice.brands]
      }

      return {
        site,
        header: {
          name: branchOffice.name,
          address: branchOffice.address,
          location: branchOffice.commune
        },
        branchButton: {
          site,
          label: 'Ir a la sucursal',
          onClick: (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            window.open(
              `http://www.google.com/maps/place/${branchOffice.latitude},${branchOffice.longitude}`,
              '_blank'
            )
          }
        },
        schedule: buildSchedule(
          branchOffice.scheduleSale,
          branchOffice.schedulePostSale
        ),
        sections: buildSections(branchOffice.services, parsedBrands) as any,
        whatsapp: {
          url: branchOffice.whatsapp
            ? `https://wa.me/${branchOffice.whatsapp}`
            : '',
          label: branchOffice.whatsapp?.toString() ?? null
        },
        expanded: index === selectedBranchOffice,
        onClick: () => {
          setSelectedBranchOffice(index === selectedBranchOffice ? null : index)
        }
      }
    })
  }, [branchOfficesData, selectedBranchOffice])

  const notFoundTextClasses = useMemo(() => {
    return getNotFoundTextClasses(site)
  }, [site])

  const formatPhoneNumber = (phoneNumber: string): string => {
    switch (site) {
      case SitesNames.WIGO_MOTORS:
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 7)}`

      case SitesNames.PORTILLO:
        return `${phoneNumber.slice(0, 1)} ${phoneNumber.slice(
          1,
          5
        )} ${phoneNumber.slice(5)}`

      default:
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
          3,
          6
        )} ${phoneNumber.slice(6)}`
    }
  }

  const formatPhoneNumberUrl = (phoneNumber: string): string => {
    switch (site) {
      case SitesNames.WIGO_MOTORS:
        return `tel:+51${phoneNumber}`

      default:
        return `tel:+56${phoneNumber}`
    }
  }

  useEffect(() => {
    if (selectedBranchOffice !== null) {
      const branchOffice = branchOfficesData[selectedBranchOffice]
      map?.panTo({ lat: branchOffice.latitude, lng: branchOffice.longitude })
      map?.setZoom(18)
    }
  }, [selectedBranchOffice])

  useEffect(() => {
    if (selectedBranchOffice === null && branchOfficesData[0] !== undefined) {
      map?.panTo({
        lat: branchOfficesData[0].latitude,
        lng: branchOfficesData[0].longitude
      })
    }
    onHandleMarkers()
  }, [branchOfficesData])

  useEffect(() => {
    setSelectedBranchOffice(null)
  }, [selectedService, selectedCity, selectedBrand])

  const onHandleMarkers = () => {
    let markersUbi: Array<{ latitud: number; longitud: number }> = []
    branchOfficesData?.forEach((branchOffices) => {
      markersUbi.push({
        latitud: branchOffices.latitude,
        longitud: branchOffices.longitude
      })
    })
    setMarkersUbication(markersUbi)
  }

  return (
    <div>
      <MlBreadcrumb
        className={TmBranchOfficesMainClasses.breadcrumb}
        site={site}
        path={breadcrumbPath}
      />
      <MlHeading
        site={site}
        className={TmBranchOfficesMainClasses.heading}
        title='Nuestras sucursales'
        description='Tenemos un mundo de autos para ti'
        backgroundColor={BackgroundContainerColor.LIGHT}
        titleClassName={TmBranchOfficesMainClasses.headingTitle}
        descriptionClassName={TmBranchOfficesMainClasses.headingDescription}
      />
      <div className={TmBranchOfficesMainClasses.horizontalsContainer}>
        <div className={TmBranchOfficesMainClasses.horizontalsBox}>
          <MlHorizontal
            site={site}
            title='Atención venta, atención post venta, repuestos y accesorios'
            variant={MlHorizontalVariant.BRANCHES}
          >
            <div className='flex items-center'>
              <div className='mr-2'>
                <span>
                  {site === SitesNames.COSECHE
                    ? 'Contáctanos: '
                    : 'Desde fijo: '}
                </span>
                <AtLink
                  variant={AtLinkVariants.HORIZONTAL_INFO}
                  href={formatPhoneNumberUrl(supportPhoneNumber)}
                  target={'_self'}
                  label={formatPhoneNumber(supportPhoneNumber)}
                  site={site}
                />
              </div>
              {site !== SitesNames.COSECHE && (
                <div>
                  <span>Desde celular: </span>
                  <AtLink
                    variant={AtLinkVariants.HORIZONTAL_INFO}
                    href={`tel:${supportMobilePhone}`}
                    target={'_self'}
                    label={supportMobilePhone}
                    site={site}
                  />
                </div>
              )}
            </div>
          </MlHorizontal>
          <MlHorizontal
            site={site}
            title='¿Tienes consultas?'
            description='Revisa nuestra sección de'
            link={{
              href: supportUrl,
              target: '_blank',
              label: 'Atención al cliente',
              site
            }}
            variant={MlHorizontalVariant.BRANCHES}
          />
        </div>
      </div>
      <div className={TmBranchOfficesMainClasses.selectMainContainer}>
        <div className={TmBranchOfficesMainClasses.selectsBoxContainer}>
          <AtSelectCatalog
            variant={AtSelectCatalogVariants.GROUP}
            containerClass={TmBranchOfficesMainClasses.selectsContainer}
            className='w-full rounded-lg sm:rounded-r-none'
            selectedValue={selectedService}
            onSelect={(newService: SelectOption | null) => {
              setSelectedService(newService)
              setSelectedCity(null)
              setSelectedBrand(null)
            }}
            options={services}
            site={site}
            label='Servicios'
            optionsClassName={TmBranchOfficesMainClasses.selectsOptions}
            transitionClassName={TmBranchOfficesMainClasses.selectsTransition}
            loading={loadingServices}
          />
          <AtSelectCatalog
            variant={AtSelectCatalogVariants.GROUP}
            containerClass={TmBranchOfficesMainClasses.selectsContainer}
            className={`w-full ${
              enableBrandsBy?.toUpperCase() ===
              selectedService?.value.toUpperCase()
                ? 'rounded-lg sm:rounded-none'
                : 'rounded-lg sm:rounded-l-none'
            }`}
            selectedValue={selectedCity}
            onSelect={(newCity: SelectOption | null) => {
              setSelectedCity(newCity)
              setSelectedBrand(null)
            }}
            options={cities}
            site={site}
            label='Ciudad'
            optionsClassName={TmBranchOfficesMainClasses.selectsOptions}
            transitionClassName={TmBranchOfficesMainClasses.selectsTransition}
            loading={loadingCities}
          />
          {enableBrandsBy?.toUpperCase() ===
            selectedService?.value.toUpperCase() && (
            <AtSelectCatalog
              variant={AtSelectCatalogVariants.GROUP}
              containerClass={TmBranchOfficesMainClasses.selectsContainer}
              className='w-full rounded-lg sm:rounded-l-none'
              selectedValue={selectedBrand}
              onSelect={setSelectedBrand}
              options={brands}
              site={site}
              label='Marcas'
              optionsClassName={TmBranchOfficesMainClasses.selectsOptions}
              transitionClassName={TmBranchOfficesMainClasses.selectsTransition}
              loading={loadingBrands}
            />
          )}
        </div>
      </div>
      <div className={TmBranchOfficesMainClasses.contentContainer}>
        {branchOfficesData.length === 0 && loadingBranchOffices === false ? (
          <div className={TmBranchOfficesMainClasses.notFoundImageContainer}>
            <img
              src={notFoundImage.file.url}
              alt='Not found branch office'
              width='auto'
              height='auto'
              className={TmBranchOfficesMainClasses.notFoundImage}
            />
            <p className={notFoundTextClasses.notFoundText}>
              No tenemos una sucursal con tu criterio de búsqueda
            </p>
          </div>
        ) : (
          <div className={TmBranchOfficesMainClasses.mapSection}>
            <div className={TmBranchOfficesMainClasses.mapContainer}>
              <Wrapper
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ''}
                render={render}
              >
                <MapComponent
                  style={{
                    width: '100%',
                    flex: 1
                  }}
                  // zoom={6}
                  // center={{ lat: 40.45694, lng: 35.64827 }}
                  onMarkersPosition={markersUbication}
                  onMapReady={setMap}
                >
                  {branchOfficesData.map((branchOffices, idx) => (
                    <Marker
                      key={idx}
                      position={{
                        lat: branchOffices.latitude,
                        lng: branchOffices.longitude
                      }}
                      branchOfficesData={branchOfficesData}
                      markerId={branchOffices?.id}
                      openBranchOffice={openBranchOffice}
                    />
                  ))}
                </MapComponent>
              </Wrapper>
            </div>
            <div className={TmBranchOfficesMainClasses.branchOfficesContainer}>
              {loadingServices ||
              loadingBrands ||
              loadingCities ||
              loadingBranchOffices ? (
                skeletonArray.map((_, idx) => (
                  <MlSkeleton
                    key={idx}
                    site={site}
                    variant={MlSkeletonVariants.ML_CARD_BRANCH}
                  />
                ))
              ) : (
                <MlBranchesSidebar site={site} branches={branchOfficeCards} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
