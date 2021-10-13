export type Alert = {
  id: string
  active: boolean
  deleted: boolean
  createAt: Date
  updateAt: Date
  emergency: string | null
  event: string | null
  alert: string | null
  deviceId: string
}
