import { createContext, useContext, JSX, PropsWithChildren } from 'react'
import type { Services } from '../services/types'
import { defaultServices } from '../services/defaultServices'

const ServicesContext = createContext<Services | null>(null)

export interface ServicesProviderProps extends PropsWithChildren {
  services?: Services
}

export function ServicesProvider({ children, services = defaultServices }: ServicesProviderProps): JSX.Element {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
}

export function useServices(): Services {
  return useContext(ServicesContext) ?? defaultServices
}
