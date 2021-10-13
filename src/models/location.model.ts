export type Location = {
  id: string
  active: boolean
  deleted: boolean
  createAt: Date
  updateAt: Date
  serverTime: Date
  fixTime: Date
  satellite: number
  latitude: number
  longitude: number
  speed: number
  course: string
  cellId: string
  mcc: number | null
  mnc: number | null
  lac: number | null
  deviceId: string
}
