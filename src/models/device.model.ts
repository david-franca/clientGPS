import { Alert } from './alert.model'
import { Location } from './location.model'
import { Status } from './status.model'

export enum Model {
  SUNTECH,
  GT06,
}

export enum MobileOperator {
  Claro,
  Oi,
  Tim,
  Vivo,
  Vodafone,
  Outras,
}

enum Timezone {
  GMT_14 = 'GMT-14',
  GMT_13 = 'GMT-13',
  GMT_12 = 'GMT-12',
  GMT_11 = 'GMT-11',
  GMT_10 = 'GMT-10',
  GMT_9 = 'GMT-9',
  GMT_8 = 'GMT-8',
  GMT_7 = 'GMT-7',
  GMT_6 = 'GMT-6',
  GMT_5 = 'GMT-5',
  GMT_4 = 'GMT-4',
  GMT_3 = 'GMT-3',
  GMT_2 = 'GMT-2',
  GMT_1 = 'GMT-1',
  GMT1 = 'GMT+1',
  GMT2 = 'GMT+2',
  GMT3 = 'GMT+3',
  GMT4 = 'GMT+4',
  GMT5 = 'GMT+5',
  GMT6 = 'GMT+6',
  GMT7 = 'GMT+7',
  GMT8 = 'GMT+8',
  GMT9 = 'GMT+9',
  GMT10 = 'GMT+10',
  GMT11 = 'GMT+11',
  GMT12 = 'GMT+12',
}

export interface Device {
  id: string
  active: boolean
  deleted: boolean
  createAt: string
  updateAt: string
  code: number
  description: string
  model: Model
  equipmentNumber: string
  phone: string
  mobileOperator: MobileOperator
  chipNumber: string
  timezone: Timezone
  location: Location[]
  alert: Alert[]
  status: Status[]
}
