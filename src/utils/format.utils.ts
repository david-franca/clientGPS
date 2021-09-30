export const capitalizeWords = (fullName: string): string => {
  const nameArray = fullName.toLowerCase().split(' ')

  return nameArray
    .map((name) => {
      return name[0].toUpperCase() + name.substr(1)
    })
    .join(' ')
}
