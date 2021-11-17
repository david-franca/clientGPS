export type BranchData = {
  id: string
  active: boolean
  deleted: boolean
  createAt: string
  updateAt: string
  customerId: string
  name: string
}

export type BranchForm = {
  customerId: string
  name: string
}
