import { AtButtonLink } from '@gac/core-components'
import { SelectionButtonsProps } from './types'

export const SelectionButtons = ({
  labelAccepted,
  labelRejected,
  site,
  onClickAccepted,
  onClickRejected,
  actionValueAccepted,
  actionValueRejected
}: SelectionButtonsProps) => {
  return (
    <div className='md:px-6 flex gap-y-6 flex-wrap p-4'>
      <AtButtonLink
        actionValue={actionValueAccepted}
        labelClassname='w-[238px] md:w-full'
        onClick={onClickAccepted}
        variant={'large'}
        className='cursor-pointer'
        label={labelAccepted}
        site={site}
        disabled={false}
      />

      <AtButtonLink
        actionValue={actionValueRejected}
        labelClassname='w-[238px] md:w-full'
        onClick={onClickRejected}
        variant={'large'}
        className='cursor-pointer'
        label={labelRejected}
        site={site}
        disabled={false}
      />
    </div>
  )
}
