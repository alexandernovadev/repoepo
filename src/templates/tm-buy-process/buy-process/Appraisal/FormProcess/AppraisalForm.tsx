import {
  AtButton,
  AtButtonVariant,
  AtInputDropdown
} from '@gac/core-components'
import { inputSelectOptionsClasses } from '../../../classes'
import { mileageOptions } from './resolvers'
import { AppraisalFormProps } from './types'

export const AppraisalForm = ({
  className = 'gap-10',
  buttonText = 'Continuar',
  submitHandler,
  appraisal,
  handler,
  selectState,
  site,
  isUploading,
  hasMissingField,
}: AppraisalFormProps) => {
  const { brand, mileage, model, version, year } = appraisal

  return (
    <form
      className={`w-full flex flex-col ${className}`}
      onSubmit={submitHandler}
    >
      <AtInputDropdown
        handleChange={(value) => handler({ name: 'year', value })}
        selectedValue={year.toString()}
        placeholder='Año de fabricación'
        disabled={selectState.year.disabled || isUploading}
        loading={selectState.year.loading}
        options={selectState.year.options}
        optionsClassName={inputSelectOptionsClasses}
        site={site}
      />
      <AtInputDropdown
        handleChange={(value) => handler({ name: 'brand', value })}
        selectedValue={brand}
        placeholder='Marca'
        disabled={selectState.brand.disabled || isUploading}
        loading={selectState.brand.loading}
        options={selectState.brand.options}
        optionsClassName={inputSelectOptionsClasses}
        site={site}
      />
      <AtInputDropdown
        handleChange={(value) => handler({ name: 'model', value })}
        selectedValue={model}
        placeholder='Modelo'
        disabled={selectState.model.disabled || isUploading}
        loading={selectState.model.loading}
        options={selectState.model.options}
        optionsClassName={inputSelectOptionsClasses}
        site={site}
      />
      <AtInputDropdown
        handleChange={(value) => handler({ name: 'version', value })}
        selectedValue={version}
        placeholder='Versión'
        disabled={selectState.version.disabled || isUploading}
        loading={selectState.version.loading}
        options={selectState.version.options}
        optionsClassName={inputSelectOptionsClasses}
        site={site}
      />
      <AtInputDropdown
        handleChange={(value) => handler({ name: 'mileage', value })}
        selectedValue={mileage}
        placeholder='Kilometraje'
        options={mileageOptions}
        optionsClassName={inputSelectOptionsClasses}
        disabled={isUploading}
        site={site}
      />

      <AtButton
        label={buttonText}
        className='h-8 self-center'
        disabled={hasMissingField || isUploading}
        variant={
          isUploading ? AtButtonVariant.LOADING : AtButtonVariant.PRIMARY
        }
        site={site}
      />
    </form>
  )
}
