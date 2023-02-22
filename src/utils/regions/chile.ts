import { ChileLocation } from './types'

export class Chile {
  locations: ChileLocation

  constructor(locations: ChileLocation) {
    this.locations = locations

    this.regions = this.regions.bind(this)
    this.findCities = this.findCities.bind(this)
    this.findRegionId = this.findRegionId.bind(this)
  }

  async regions() {
    return this.locations?.reduce<string[]>(
      (array, { key }) => [...array, key],
      []
    )
  }

  async findCities({ region }: Record<string, string>) {
    return this.locations.find(({ key }) => key === region)?.values ?? []
  }

  findRegionId(region: string) {
    return this.locations.find((r) => r.key === region)?.id
  }
}
