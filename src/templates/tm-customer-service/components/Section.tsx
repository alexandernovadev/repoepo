import {
  AtSelectCatalog,
  AtSelectCatalogVariants,
  MlCollapsible,
  MlCollapsibleDirection,
  MlRichText,
  MlRichTextVariant
} from '@gac/core-components'
import { useMemo, useState } from 'react'
import { variantSelector } from '../classes'
import { SectionProps } from '../types'

export const Section = ({ sectionTitle, sections, site }: SectionProps) => {
  const [currentSection, setCurrentSection] = useState(0)

  const availableOptions = useMemo(() => {
    if (sections) {
      return sections.map((section, idx) => ({
        label: section.title,
        value: idx.toString()
      }))
    }
  }, [])

  return (
    <>
      {(sectionTitle || availableOptions) && (
        <hr className='bg-gray-200 w-full mb-16 md:mb-14 lg:mb-12' />
      )}
      {sectionTitle && (
        <h2
          id={sectionTitle.href}
          className='text-gray-900 text-xl leading-7 md:text-2xl md:leading-8 mb-14 lg:mb-10'
        >
          {sectionTitle.label}
        </h2>
      )}
      {availableOptions && (
        <>
          <div className='flex w-full md:w-[25rem] mb-10'>
            <AtSelectCatalog
              optionsClassName='left-0 right-0'
              transitionClassName='!w-full'
              containerClass='flex-1'
              className='w-full'
              selectedValue={availableOptions[currentSection]}
              options={availableOptions}
              variant={AtSelectCatalogVariants.FAQ}
              onSelect={(option) =>
                setCurrentSection(Number.parseInt(option?.value!, 10))
              }
              site={site}
            />
          </div>
          <div className='mb-20 md:mb-8 lg:mb-[4.5rem] w-full flex flex-col'>
            {sections?.[currentSection].tabs?.map((item, index, array) => (
              <MlCollapsible
                label={item.title}
                key={item.title}
                site={site}
                childrenClassName={`p-3 ${
                  index === array.length - 1 ? 'rounded-b-2xl' : ''
                }`}
                variant={variantSelector(index, array.length)}
                direction={MlCollapsibleDirection.ROW}
              >
                <MlRichText
                  text={item.content}
                  site={site}
                  variant={MlRichTextVariant.REDUCED_MARGIN}
                  className='text-gray-600 text-sm leading-5'
                />
              </MlCollapsible>
            ))}
          </div>
        </>
      )}
    </>
  )
}
