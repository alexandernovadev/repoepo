import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from '../src/redux/store'
import TagManager from 'react-gtm-module'
import '../src/styles/global.css'
import '@gac/core-components/lib/main.css'
import { gacSites, getGTMKeyBySite } from '../src/sites/gacSites'

let persistor = persistStore(store)

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (pageProps.site) {
      const tagManagerArgs = {
        gtmId: getGTMKeyBySite(gacSites(pageProps?.site?.trim())) as string
      }
      TagManager.initialize(tagManagerArgs)
    }
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {() => <Component {...pageProps} />}
      </PersistGate>
    </Provider>
  )
}

export default MyApp
