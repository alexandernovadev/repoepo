import { CSSProperties } from 'react'

export interface MapProps extends google.maps.MapOptions {
  style?: CSSProperties
  onClick?: (e: google.maps.MapMouseEvent) => void
  onIdle?: (map: google.maps.Map) => void
  onMapReady?: (map: google.maps.Map) => void
  onMarkersPosition?: Array<{latitud: number, longitud: number}>
}
export type LatLng = {
  lat: number
  lng: number
}

export interface query {
  width: string
  height: string
}

export interface Map extends google.maps.MapOptions {
  coordinates: any
  breakpoints: {
    desktop: query
    tablet: query
    mobile: query
  }
  onMapReady?: (map: google.maps.Map) => void,
  initialZoom: number
}