import { AtTextArea, MlRichText } from '@gac/core-components'
import { MlRichTextVariant } from '../../../../types'
import { ChooseButton } from '../../choose-button'
import { FormsClasses } from '../../classes'
import { useComplainsBook } from '../../context/complainstBookContext'
import { ComplaintsProps } from '../../types'
import { ComplainstButtonsData } from './data'

export const ComplaintsForm = ({ site, consumerTerms }: ComplaintsProps) => {
  const { forms, onFormChange } = useComplainsBook()

  return (
    <form className={FormsClasses.cardContainer}>
      <h3 className={`${FormsClasses.title} mb-10`}>
        Detalle de la reclamación y pedido del consumidor
      </h3>
      <div className={FormsClasses.inputsContainer}>
        <ChooseButton
          site={site}
          buttonsData={ComplainstButtonsData}
          activeButton={forms?.complaints?.type}
          setActiveButton={(label: string) => {
            onFormChange('complaints', 'type', label)
          }}
        />
        <AtTextArea
          value={forms.complaints.description}
          handleChange={({ name, value }) => {
            onFormChange('complaints', name, value)
          }}
          id='description'
          className={`min-h-[5.75rem] ${FormsClasses.inputTextArea}`}
          containerClassName='!w-full md:w-auto'
          placeholder='Descripción'
          disabled={false}
          site={site}
          helpText='Indique los detalles del Reclamo o Queja'
        />
        <AtTextArea
          value={forms.complaints.complaintsOrder}
          handleChange={({ name, value }) => {
            onFormChange('complaints', name, value)
          }}
          id='complaintsOrder'
          className={`min-h-[5.75rem] ${FormsClasses.inputTextArea}`}
          containerClassName='!w-full md:w-auto'
          placeholder='Pedido'
          disabled={false}
          site={site}
          helpText='Indique lo que usted solicita de compensación'
        />
        <div className={FormsClasses.lineSeparator} />
      </div>
      <MlRichText
        variant={MlRichTextVariant.NEWS}
        site={site}
        text={consumerTerms}
      />
    </form>
  )
}
