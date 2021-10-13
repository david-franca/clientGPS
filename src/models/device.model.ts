import { Alert } from './alert.model'
import { Location } from './location.model'
import { Status } from './status.model'

export interface Device {
  id: string
  active: boolean
  deleted: boolean
  createAt: string
  updateAt: string
  code: number
  description: string
  model: string
  equipmentNumber: string
  phone: string
  mobileOperator: string
  chipNumber: string
  timezone: string
  location: Location[]
  alert: Alert[]
  status: Status[]
}
