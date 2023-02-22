import { UseComponentProps } from './types'
import { UsadosComponent } from './Usados'

export const sidebarFiltersComponents: any = {
  Usado: {
    active: true,
    component: ({ site, activeFilters, setFilters }: UseComponentProps) => (
      <UsadosComponent
        site={site}
        activeFilters={activeFilters}
        setFilters={setFilters}
      />
    )
  }
}
