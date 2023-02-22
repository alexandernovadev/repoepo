import React from 'react'
import { MlRichText, MlRichTextVariant } from '@gac/core-components'
import { toSlug } from '../../../utils/toSlug'
import { classes } from '../classes'
import { ContentProps } from '../types'

export const DesktopView: React.FC<ContentProps> = ({ sections, site }) => {
  return (
    <div className={classes.desktop.contentWrapper}>
      {sections &&
        sections.map((section) => {
          return (
            <section className={classes.desktop.section} key={section.title}>
              <h2 className={classes.desktop.sectionTitle}>{section.title}</h2>
              {section.tabs.map((item) => {
                return (
                  <div
                    id={toSlug(item.title)}
                    key={item.title}
                    className={classes.desktop.item}
                  >
                    <h4
                      className={
                        item.isBoldTitle
                          ? classes.desktop.boldItemTitle
                          : classes.desktop.itemTitle
                      }
                    >
                      {item.title}
                    </h4>
                    <MlRichText
                      site={site}
                      text={item.content}
                      variant={MlRichTextVariant.LEGAL}
                    />
                  </div>
                )
              })}
            </section>
          )
        })}
    </div>
  )
}
