import { Vehicle } from '../models'

// type Condition = 'startsWitch' | 'endsWitch' | 'equals'

export const filterVehicles = (
  value: Vehicle[],
  condition: string,
  parameter?: string
): Vehicle[] => {
  switch (condition) {
    case 'startsWith':
      return parameter
        ? value.filter(data => data.licensePlate.startsWith(parameter ?? ''))
        : []

    case 'endsWith':
      return parameter
        ? value.filter(data => data.licensePlate.endsWith(parameter))
        : []

    case 'equals':
      return []

    default:
      return []
  }
}
