/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/salazar_israel/:slug*',
        destination: '/',
        permanent: true
      },
      {
        source: '/servicio-al-cliente',
        destination: '/atencion-al-cliente',
        permanent: true
      },
      {
        source: '/catalogo-vehicular',
        destination: '/catalog',
        permanent: true
      },
      {
        source: '/catalogo',
        destination: '/catalog',
        permanent: true
      }
    ]
  }
}
