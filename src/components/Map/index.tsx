import React, { useEffect } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { Map as MapType, MapProps } from './types'
import { useDeepCompareEffectForMaps } from './mapUtils'

export const render = () => {
  return (
    <>
      <div className='bg-white flex flex-col py-14  items-center lg:bg-transparent lg:my-32'>
        <svg
          className='inline mr-2 w-14 h-14 text-gray-200 animate-spin  fill-gray-500'
          viewBox='0 0 100 101'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
            fill='currentColor'
          />
          <path
            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
            fill='currentFill'
          />
        </svg>
        <p className='text-2xl  font-light leading-8 text-gray-400 mt-7'>
          Cargando mapa
        </p>
      </div>
    </>
  )
}

export const Map = ({
  coordinates,
  breakpoints,
  onMapReady,
  initialZoom
}: MapType) => {
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([])
  const [zoom, setZoom] = React.useState(initialZoom) // initial zoom
  const [center, setCenter] =
    React.useState<google.maps.LatLngLiteral>(coordinates)

  const [mapHeight, setMapHeight] = React.useState<string>(
    breakpoints.mobile.height
  )
  const [mapWidth, setMapWidth] = React.useState<string>(
    breakpoints.mobile.width
  )

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!])
  }

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!)
    setCenter(m.getCenter()!.toJSON())
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1279) {
        setMapWidth(breakpoints.desktop.width)
        setMapHeight(breakpoints.desktop.height)
      } else if (window.innerWidth > 767) {
        setMapWidth(breakpoints.tablet.width)
        setMapHeight(breakpoints.tablet.height)
      } else {
        setMapWidth(breakpoints.mobile.width)
        setMapHeight(breakpoints.mobile.height)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      setMapWidth('')
      setMapHeight('')
    }
  }, [])
  return (
    <div>
      <Wrapper
        apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
        render={render}
      >
        <MapComponent
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          onMapReady={onMapReady}
          zoom={zoom}
          style={{ flexGrow: '1', width: mapWidth, height: mapHeight }}
        >
          <Marker position={coordinates} />
        </MapComponent>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
    </div>
  )
}

export const MapComponent: React.FC<MapProps> = ({
  onClick,
  onIdle,
  onMapReady,
  onMarkersPosition,
  children,
  style,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {})
      setMap(newMap)
      onMapReady?.(newMap)
    }
  }, [ref, map])

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options)
    }
  }, [map, options])

  React.useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      )

      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  React.useMemo(() => {
    if (onMarkersPosition && onMarkersPosition.length > 0) {
      let bounds = new google.maps.LatLngBounds()
      onMarkersPosition?.map((marker: any) =>
        bounds.extend(new google.maps.LatLng(marker?.latitud, marker?.longitud))
      )
      map?.fitBounds(bounds)
    }
  }, [map, onMarkersPosition])

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
}

export const Marker: React.FC<google.maps.MarkerOptions | any> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>()

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }
    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  React.useEffect(() => {
    if (marker) {
      const listener = marker?.addListener('click', () => {
        if (options.markerId) {
          options?.openBranchOffice(options.markerId)
          // options.map?.setCenter(marker.getPosition() as google.maps.LatLng)
        }
      })
      return () => google.maps.event.removeListener(listener)
    }
  }, [marker, options.markerId])

  return null
}
