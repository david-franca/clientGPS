import { cnpj, cpf } from 'cpf-cnpj-validator'

export const validateCpfCnpj = (number: string): boolean => {
  return cpf.isValid(number) || cnpj.isValid(number)
}
