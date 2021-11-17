import { DeviceData } from './device.model'

export type Vehicle = {
  id: string
  active: boolean
  deleted: boolean
  createAt: string
  updateAt: string
  licensePlate: string
  type: string
  deviceId: string
  customerId: string
  branchId: string
  brand: string
  model: string
  color: string
  year: number
  chassi: string
  renavam: string
  observation: string
  device?: DeviceData
}

export type VehicleForm = {
  licensePlate: string
  type: string
  deviceId: string
  customerId: string
  branchId: string
  brand: string
  model: string
  color: string
  year: number
  chassi: string
  renavam: string
  observation?: string
  device?: DeviceData
}
