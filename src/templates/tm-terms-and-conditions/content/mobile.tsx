import React from 'react'
import {
  MlCollapsible,
  MlCollapsibleDirection,
  MlCollapsibleVariant,
  MlRichText,
  MlRichTextVariant
} from '@gac/core-components'
import { classes } from '../classes'
import { ContentProps } from '../types'

export const MobileView: React.FC<ContentProps> = ({ sections, site }) => {
  return (
    <div className={classes.mobile.contentWrapper}>
      <div className={classes.sidebar}>
        {sections &&
          sections.map((section) => {
            return (
              <div key={section.title} className={classes.mobile.wrapper}>
                <h2 className={classes.mobile.title}>{section.title}</h2>
                {section.tabs.map((item) => {
                  return (
                    <div className={classes.mobile.item} key={item.title}>
                      <MlCollapsible
                        label={item.title}
                        site={site}
                        variant={MlCollapsibleVariant.FAQ}
                        direction={MlCollapsibleDirection.ROW}
                      >
                        <MlRichText
                          className={classes.mobile.richText}
                          text={item.content}
                          site={site}
                          variant={MlRichTextVariant.LEGAL}
                        />
                      </MlCollapsible>
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
