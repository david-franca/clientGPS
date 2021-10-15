/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Checkbox,
  CleanIcon,
  Combobox,
  ExportIcon,
  FilterIcon,
  Icon,
  IconButton,
  KeyIcon,
  MapIcon,
  Pane,
  PaneProps,
  Position,
  RefreshIcon,
  SearchInput,
  Table,
  Text,
  TickIcon,
} from 'evergreen-ui'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { Head, Loading, Menu } from '../../components'
import { configMenu } from '../../config/menu.config'
import { useAxios } from '../../hooks/useAxios'
import { Customer } from '../../models/customer.model'
import { Vehicle } from '../../models/vehicles.model'
import { capitalizeWords } from '../../utils'

enum Refresh {
  DONT = 'Não atualizar',
  S30 = '30 segundos',
  M1 = '1 Minuto',
  M2 = '2 minutos',
  M3 = '3 minutos',
  M5 = '5 Minutos',
  M10 = '10 Minutos',
}

const MapWithNoSSR = dynamic(() => import('../../components/map/Map'), {
  ssr: false,
})

const paneRowFilters: PaneProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
}

const Platform: NextPage = () => {
  const [customerId, setCustomerId] = useState('')
  const [refreshTime, setRefreshTime] = useState<Refresh>(Refresh.DONT)

  const toggleActive = (customer: Customer) => {
    if (customer.id === customerId) {
      setCustomerId('')
    } else {
      setCustomerId(customer.id)
    }
  }

  const { data: customers } = useAxios<Customer[]>('customers', {})
  const { data: vehicles } = useAxios<Vehicle[]>(
    `vehicles?where={"customerId":"${customerId}"}`,
    {}
  )

  if (!customers) {
    return <Loading />
  }

  return (
    <Pane>
      <Head title="Plataforma" />
      <Menu config={configMenu} />
      <Pane display="flex">
        <Pane about="customers" width="20vw" height="70vh">
          <Table borderRadius="none">
            <Table.Head height="3vh">
              <Table.TextHeaderCell
                maxWidth="18%"
                borderRight={true}
              ></Table.TextHeaderCell>
              <Table.TextHeaderCell>Clientes</Table.TextHeaderCell>
            </Table.Head>
            <Table.VirtualBody height="67vh">
              {customers.map((customer, index) => (
                <Table.Row
                  key={customer.id}
                  isSelectable
                  background={customerId === customer.id ? 'green300' : ''}
                  onSelect={() => toggleActive(customer)}
                >
                  <Table.TextCell
                    borderRight={true}
                    textAlign="end"
                    maxWidth="18%"
                    isNumber
                  >
                    {index + 1}
                  </Table.TextCell>
                  <Table.TextCell>
                    {capitalizeWords(customer.fullName)}
                  </Table.TextCell>
                </Table.Row>
              ))}
            </Table.VirtualBody>
          </Table>
        </Pane>
        <Pane className="leaflet-container" about="map" zIndex={1}>
          <MapWithNoSSR vehicles={customerId && vehicles ? vehicles : []} />
        </Pane>
      </Pane>
      <Pane width="100vw" border={true}>
        <Pane
          {...paneRowFilters}
          about="container-filter-vehicles"
          height="3vh"
          justifyContent="space-around"
        >
          <Pane {...paneRowFilters} width="13%">
            <Text paddingRight={6}>Filtro:</Text>
            <Combobox
              items={['Veículo', 'Cliente', 'Placa']}
              width="100%"
              height="3vh"
            />
          </Pane>
          <Pane {...paneRowFilters} width="5%">
            <Combobox
              items={['=', '<>', '>=', '<=']}
              width="100%"
              height="3vh"
            />
          </Pane>
          <Pane {...paneRowFilters} width="20%">
            <SearchInput placeholder="Digite um parâmetro" width="100%" />
          </Pane>
          <Pane {...paneRowFilters} width="7%">
            <IconButton width="33%" height="3vh" icon={TickIcon} />
            <IconButton
              width="33%"
              height="3vh"
              icon={CleanIcon}
              onClick={() => setCustomerId('')}
            />
            <IconButton width="33%" height="3vh" icon={FilterIcon} />
          </Pane>
          <Pane {...paneRowFilters} width="15%">
            <Text paddingRight={6}>Atualização:</Text>
            <Combobox
              initialSelectedItem={{ label: Refresh.DONT }}
              items={[
                { label: Refresh.DONT },
                { label: Refresh.S30 },
                { label: Refresh.M1 },
                { label: Refresh.M2 },
                { label: Refresh.M3 },
                { label: Refresh.M5 },
                { label: Refresh.M10 },
              ]}
              itemToString={item => (item ? item.label : '')}
              width="100%"
              height="3vh"
              onChange={selected => setRefreshTime(selected.label)}
            />
          </Pane>
          <Pane {...paneRowFilters} width="7%">
            <IconButton width="33%" height="3vh" icon={RefreshIcon} />
            <IconButton width="33%" height="3vh" icon={ExportIcon} />
            <IconButton width="33%" height="3vh" icon={MapIcon} />
          </Pane>
          <Pane {...paneRowFilters} width="12%">
            <Text paddingRight={6}>Registros:</Text>
            <Combobox
              initialSelectedItem={{ label: '50' }}
              items={[
                { label: '50' },
                { label: '100' },
                { label: '200' },
                { label: '300' },
                { label: '500' },
                { label: '1000' },
                { label: '5000' },
              ]}
              itemToString={item => (item ? item.label : '')}
              width="100%"
              height="3vh"
            />
          </Pane>
          <Pane {...paneRowFilters}>
            <Checkbox width="100%" label="Exibir Registros Inativos" />
          </Pane>
        </Pane>
        <Table>
          <Table.Head height="3vh">
            <Table.TextHeaderCell>Placa</Table.TextHeaderCell>
            <Table.TextHeaderCell>Motorista</Table.TextHeaderCell>
            <Table.TextHeaderCell>Última Atualização</Table.TextHeaderCell>
            <Table.TextHeaderCell>Velocidade</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height="20vh">
            {customerId && vehicles
              ? vehicles.map(vehicle => (
                  <Table.Row key={vehicle.id} isSelectable>
                    <Table.TextCell>{vehicle.licensePlate}</Table.TextCell>
                    <Table.TextCell>{}</Table.TextCell>
                    <Table.TextCell>
                      {vehicle.device?.location[0]?.fixTime
                        ? new Date(
                            vehicle.device?.location[0]?.fixTime
                          ).toLocaleDateString('pt-br', {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZoneName: 'short',
                          })
                        : ''}
                    </Table.TextCell>
                    <Table.TextCell>
                      {vehicle.device?.location[0]?.speed}
                    </Table.TextCell>
                    <Table.TextCell>
                      {vehicle.device?.status[0]?.ignition ? (
                        <Icon
                          icon={KeyIcon}
                          color={
                            vehicle.device?.status[0]?.ignition
                              ? 'green'
                              : 'gray'
                          }
                        />
                      ) : (
                        ''
                      )}
                    </Table.TextCell>
                  </Table.Row>
                ))
              : ''}
          </Table.VirtualBody>
        </Table>
      </Pane>
    </Pane>
  )
}

export default Platform
