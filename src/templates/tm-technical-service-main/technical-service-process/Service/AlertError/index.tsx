import { AlertErrorProps } from './types'
import { AlertErrorClasses } from './classes'

export const AlertError = ({
  className = '',
  title = 'Ha ocurrido un error',
  children
}: AlertErrorProps) => {
  return (
    <div className={`${className} ${AlertErrorClasses.container}`}>
      <div className={`${AlertErrorClasses.imageContainer}`}>
        <img
          src='/assets/at-warningicon.png'
          alt='warning'
          loading='lazy'
          width='auto'
          height='auto'
          className={`${AlertErrorClasses.image}`}
        />
      </div>
      <div>
        <p className={`${AlertErrorClasses.text}  mb-6 md:mb-0`}>{title}</p>
        <p className={AlertErrorClasses.text}>{children}</p>
      </div>
    </div>
  )
}
