import type { IpcMainInvokeEvent } from 'electron'

export type IpcHandle = (event: IpcMainInvokeEvent, ...args: any[]) => unknown
export type ParametersOfHandle = [channel: string, listener: IpcHandle]
