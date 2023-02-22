import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, createMigrate } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'

import catalogReducer from './features/catalogSlice'
import { migrations } from './migrations'
import buyProcessReducer from './features/buyProcessSlice'
import buyProcessV2Reducer from './features/buyProcessV2Slice'
import commonReducer from './features/commonSlice'
import quoteReducer from './features/quoteSlice'
import technicalServiceSlice from './features/technicalServiceSlice'
import certificatesReducer from './features/certificatesSlice'

const persistConfig = {
  key: 'root',
  version: 4,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ['catalog', 'certificates']
}

const reducers = combineReducers({
  technicalServiceProcess: technicalServiceSlice,
  catalog: catalogReducer,
  buyProcess: buyProcessReducer,
  buyProcessV2: buyProcessV2Reducer,
  common: commonReducer,
  quote: quoteReducer,
  certificates: certificatesReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk]
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
