import { useContext } from 'react'
import type { Services } from '../services/types'
import { defaultServices } from '../services/defaultServices'
import { ServicesContext } from '../contexts/ServicesContextValue'

export function useServices(): Services {
  return useContext(ServicesContext) ?? defaultServices
}
