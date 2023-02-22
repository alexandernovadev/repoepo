import { AtButton } from '@gac/core-components'
import { useRouter } from 'next/router'
import { AtButtonVariant } from '../../../types'
import { Confirmation } from '../../tm-customer-service/components/Confirmation'
import { TmComplainstBookClasses } from '../classes'
import { useComplainsBook } from '../context/complainstBookContext'
import { ComplaintsBookStepsProps } from '../types'
import { ComplaintsForm } from './complaints'
import { ContractedGoodsForm } from './contracted-goods'
import { PersonalForm } from './personal'
import { OnSubmitComplaintsBook } from '../api'
import { useState } from 'react'

export const ComplaintsBookSteps = ({
  site,
  template
}: ComplaintsBookStepsProps) => {
  const router = useRouter()
  const { error, render, setRender, forms } = useComplainsBook()
  const [loading, setLoading] = useState<boolean>(false)

  const submitComplainBook = async () => {
    setLoading(true)
    try {
      const result = await OnSubmitComplaintsBook(site, forms)

      if (result) {
        setRender('success')
      } else {
        router.push('/404')
      }
    } catch (error) {
      console.log(error)
      router.push('/404')
    }
    setLoading(false)
  }

  switch (render) {
    case 'forms':
      return (
        <div className={TmComplainstBookClasses.formsContainer}>
          <PersonalForm site={site} />
          <ContractedGoodsForm site={site} />
          <ComplaintsForm
            consumerTerms={template?.claimPolicies!}
            site={site}
          />
          <AtButton
            variant={
              loading ? AtButtonVariant.LOADING : AtButtonVariant.PRIMARY
            }
            disabled={error}
            label='Enviar'
            site={site}
            onClick={submitComplainBook}
            className={TmComplainstBookClasses.button}
          />
        </div>
      )
    case 'success':
      return (
        <Confirmation
          site={site}
          state={{ email: forms.personal.email.value }}
          button={{
            show: true,
            label: 'Ir al Home',
            variant: AtButtonVariant.SECONDARY_TEXT,
            onClick: () => router.push('/')
          }}
        />
      )
    default:
      return <></>
  }
}
