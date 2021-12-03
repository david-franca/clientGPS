export const validateCep = (cep: string): boolean => {
  const cepClean = cep.replace(/[^\d]+/g, '')
  const exp = /\d{2}\.\d{3}\-\d{3}/
  if (!exp.test(cep) && cepClean.length !== 8) {
    return false
  }
  return true
}
