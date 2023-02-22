import { Section } from '../../types/contentful/content-model/tm-terms-and-conditions'
import { toSlug } from '../../utils/toSlug'

export const formatSidebar = (sections: Section[]) => {
  if (!sections) return []

  return sections.map((section) => {
    return {
      title: section.title,
      links: getSidebarLinks(section)
    }
  })
}

export const getSidebarLinks = (section: Section) => {
  return section.tabs.map((item) => {
    return {
      title: item.title,
      href: `#${toSlug(item.title)}`
    }
  })
}
