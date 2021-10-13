export type Status = {
  id: string
  active: boolean
  deleted: boolean
  createAt: Date
  updateAt: Date
  blocked: boolean
  valid: boolean
  charge: boolean | null
  ignition: boolean
  battery: number
  rssi: number | null
  deviceId: string
  infoId: string
}
