export const toReCaptchaHeader = (token: string) => ({
  'x-recaptcha-authorization': `reCAPTCHA ${token}`
})
