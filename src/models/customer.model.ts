export interface CustomerData {
  id: string
  active: boolean
  deleted: boolean
  createAt: string
  updateAt: string
  fullName: string
  cpfOrCnpj: string
  cellPhone: string
  landline: string
  typeOfAddress: string
  cep: string
  street: string
  number: string
  district: string
  complement: string
  state: string
  city: string
}

export interface CustomerForm {
  id?: string
  fullName: string
  cpfOrCnpj: string
  cellPhone: string
  landline?: string
  typeOfAddress: string
  cep: string
  street: string
  number: string
  district: string
  complement?: string
  state: string
  city: string
}
