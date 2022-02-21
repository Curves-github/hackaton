import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react'
import MainStore from './store'

const StoreContext = createContext({} as MainStore)

export const MainStoreProvider: FunctionComponent<{}> = ({children}) => {

  const [ store ] = useState(() => new MainStore())
  useEffect(() => {
    store.init()
    return () => store.dispose()
  }, [ store ])

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export const useMainStore = () => {
  const store = useContext(StoreContext)
  return store
}