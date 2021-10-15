interface Itens {
  name: string
  select: string
}

export const configMenu: [
  {
    name: string
    itens: Itens[]
  }
] = [
  {
    name: 'Cadastro',
    itens: [
      { name: 'Clientes', select: 'customer' },
      { name: 'Equipamento', select: 'equipamento' },
      { name: 'Filial', select: 'branch' },
      { name: 'Veículo', select: 'vehicle' },
      { name: 'Motorista', select: 'driver' },
    ],
  },
]
