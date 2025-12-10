import { JSX, PropsWithChildren } from 'react'
import type { Services } from '../services/types'
import { defaultServices } from '../services/defaultServices'
import { ServicesContext } from './ServicesContextValue'

export interface ServicesProviderProps extends PropsWithChildren {
  services?: Services
}

export function ServicesProvider({
  children,
  services = defaultServices
}: ServicesProviderProps): JSX.Element {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
}
