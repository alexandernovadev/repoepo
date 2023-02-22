export type PeruLocation = {
  [dept: string]: {
    [city: string]: {
      [district: string]: string
    }
  }
}

export type ChileLocation = {
  key: string
  id: number
  values: string[]
}[]

export type Location = PeruLocation | ChileLocation
