import { sitePrimaryTextClass } from '../../../../../sites/siteClasses'
import { SitesNames } from '../../../../../types'
import { stepTitleClasses } from '../../../common/classes'

const OldAlert = () => (
  <p className='bg-gac-main-01 p-4 rounded-2xl shadow-card leading-6 text-gray-900'>
    Hemos detectado que su auto es muy antiguo para la tasación
  </p>
)

const AcceptedAlert = () => (
  <p className={stepTitleClasses}>
    Esta tasación considera un auto en buenas condiciones. La oferta será
    confirmada con la revisión de tu auto.
  </p>
)

export const ResultTypeText = ({
  rejected,
  site
}: {
  rejected: boolean
  site: SitesNames
}) => (
  <div className='my-10'>
    <h2
      className={`${sitePrimaryTextClass(
        site
      )} mb-2.5 text-xl leading-7 font-bold `}
    >
      Resultado
    </h2>
    {rejected ? <OldAlert /> : <AcceptedAlert />}
  </div>
)
