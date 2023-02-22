import { AtLink } from '@gac/core-components'
import { useEffect } from 'react'
import { SitesNames } from '../types'

export const useReCaptcha = (site: SitesNames, isBadgeVisible?: boolean) => {
  const getReCaptchaToken = (): Promise<string> => {
    const { grecaptcha } = window as any
    if (!grecaptcha) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject()
    }

    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        resolve(grecaptcha.execute(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY))
      })
    })
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`
    document.body.appendChild(script)

    if (isBadgeVisible) {
      script.addEventListener(
        'load',
        () => {
          const { grecaptcha } = window as any

          grecaptcha.ready(() => {
            const badge = document.querySelector(
              '.grecaptcha-badge[data-style="bottomright"]'
            ) as HTMLElement
            if (badge) badge.style!.visibility = 'visible'
          })
        },
        { passive: true }
      )
    }
  }, [])

  return {
    getReCaptchaToken,
    ReCaptcha: () => (
      <div
        className='g-recaptcha'
        data-sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
        data-size='invisible'
      />
    ),
    ReCaptchaText: () => (
      <div className='text-gray-400 text-sm'>
        Este sitio está protegido por reCAPTCHA y aplican la{' '}
        <AtLink
          site={site}
          href='https://policies.google.com/privacy'
          variant='primary-bold'
          label='Política de Privacidad'
        />{' '}
        y los{' '}
        <AtLink
          site={site}
          href='https://policies.google.com/terms'
          variant='primary-bold'
          label='Términos de Servicio'
        />{' '}
        de Google
      </div>
    )
  }
}
