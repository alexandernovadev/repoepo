import { PeruLocation } from './types'

export class Peru {
  locations: PeruLocation

  constructor(locations: PeruLocation) {
    this.locations = locations

    this.departments = this.departments.bind(this)
    this.findCities = this.findCities.bind(this)
    this.findDistricts = this.findDistricts.bind(this)
  }

  async departments() {
    return Object.keys(this.locations)
  }

  async findCities({ department }: Record<string, string>) {
    return Object.keys(this.locations[department])
  }

  async findDistricts({ department, city }: Record<string, string>) {
    return Object.keys(this.locations[department]?.[city] ?? {})
  }
}
