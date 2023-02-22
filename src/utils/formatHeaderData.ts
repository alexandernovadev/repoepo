export const formatHeaderData = (response: any) => {
  let linksData: any = []

  response?.menuItems?.forEach((link: any) => {
    linksData.push({
      href: link.title?.href ?? '#',
      label: link.title?.label,
      target: link.title?.target,
      gtmData: link.title?.gtmData,
      dropDown: link.dropdown
        ? {
            variant: link.dropdown?.variant,
            button: link.dropdown?.button
              ? {
                  actionType: link.dropdown?.button?.actionType,
                  actionValue: link.dropdown?.button?.actionValue,
                  label: link.dropdown?.button?.label,
                  name: link.dropdown?.button?.name,
                  target: link.dropdown?.button?.target,
                  type: link.dropdown?.button?.variant,
                  gtmData: link.dropdown?.button?.gtmData
                }
              : null,
            sideBarbutton: link.dropdown?.sidebarButton
              ? {
                  actionType: link.dropdown?.sidebarButton?.actionType,
                  actionValue: link.dropdown?.sidebarButton?.actionValue,
                  label: link.dropdown?.sidebarButton?.label,
                  name: link.dropdown?.sidebarButton?.name,
                  target: link.dropdown?.sidebarButton?.target,
                  type: link.dropdown?.sidebarButton?.variant,
                  gtmData: link.dropdown?.sidebarButton?.gtmData
                }
              : null,
            subLinks: link.dropdown?.subLinks ? link.dropdown?.subLinks : null,
            specialSection: link.dropdown?.specialSection
              ? link.dropdown?.specialSection
              : null
          }
        : null
    })
  })

  const formatData = {
    links: linksData,
    logo: {
      name: response?.title?.label,
      href: response?.title?.href,
      target: response?.title?.target,
      gtmData: response?.title?.gtmData,
      image: {
        url: response?.title?.icon.file.url,
        fileName: response?.title?.icon.file.fileName
      }
    },
    time: response?.workingSchedule
  }

  return {
    formatData
  }
}
