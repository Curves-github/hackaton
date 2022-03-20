import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react'
import MainStore from './store'

const StoreContext = createContext({} as MainStore)

export const MainStoreProvider: FunctionComponent<{}> = ({children}) => {
  const [ready, setReady] = useState(false);
  const [ store ] = useState(() => new MainStore())
  useEffect(() => {
    let cancelled = false;
    (async ()=>{
      await store.init();
      if(!cancelled){
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
      store.dispose()
    }
  }, [ store ])

  if(!ready){
    return <></>;
  }

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