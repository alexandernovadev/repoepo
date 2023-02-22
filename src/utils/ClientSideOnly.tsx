import { PropsWithChildren, useEffect, useState } from 'react'

export const ClientSideOnly = ({ children }: PropsWithChildren<unknown>) => {
  const [shouldRender, setShouldRender] = useState(false)
  useEffect(() => setShouldRender(true), [])

  return <>{shouldRender ? children : null}</>
}
