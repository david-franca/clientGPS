import { ConfigMenu } from '../@types/menu'

export const configMenu: ConfigMenu[] = [
  {
    name: 'Cadastro',
    itens: [
      { name: 'Clientes', select: 'customer' },
      { name: 'Equipamento', select: 'device' },
      { name: 'Filial', select: 'branch' },
      { name: 'Veículo', select: 'vehicle' },
      { name: 'Motorista', select: 'driver' },
    ],
  },
]
