import Link from 'next/link'
import React, { useMemo } from 'react'
import { classes, getSiteClasses } from './classes'
import { SidebarProps } from './types'

export const Sidebar: React.FC<SidebarProps> = ({ data, site }) => {
  const { hoverLink, sidebarLink } = useMemo(() => getSiteClasses(site), [site])

  if (!data) return null

  return (
    <div className={`${classes.sidebar} ${classes.sidebarHeight}`}>
      {data?.map((item) => {
        return (
          <div key={item.title}>
            <h2 className={classes.sidebarTitle}>{item.title}</h2>
            {item?.links.map((link) => {
              return (
                <Link href={link.href} key={link.title}>
                  <span
                    className={`${classes.sidebarLink} ${sidebarLink} ${hoverLink}`}
                  >
                    {link.title}
                  </span>
                </Link>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
