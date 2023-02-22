import { TmComplaintsBookProps } from './types'
import { TmComplainstBookClasses } from './classes'
import { ComplaintsBookSteps } from './forms'
import { ComplainsBookProvider } from './context/complainstBookContext'

export const TmComplaintsBook = ({ template, site }: TmComplaintsBookProps) => {
  return (
    <ComplainsBookProvider>
      <section className={TmComplainstBookClasses.section}>
        <div className={TmComplainstBookClasses.container}>
          <div className='mb-14'>
            <h1 className={TmComplainstBookClasses.title}>{template?.title}</h1>
          </div>
          <ComplaintsBookSteps site={site} template={template} />
        </div>
      </section>
    </ComplainsBookProvider>
  )
}
