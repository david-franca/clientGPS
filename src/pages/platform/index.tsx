import { Empty } from 'antd'
import { AxiosError, AxiosResponse } from 'axios'
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
  RefreshIcon,
  SearchInput,
  Select,
  Strong,
  Table,
  Text,
  TextInput,
  TickIcon,
  Tooltip,
} from 'evergreen-ui'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { ChangeEvent, useEffect, useState } from 'react'

import { Head, Loading, Menu } from '../../components'
import { conditionsConfig, filterConfig } from '../../config'
import { configMenu } from '../../config/menu.config'
import { useAxios } from '../../hooks/useAxios'
import { Location, MobileOperator, Model, Timezone } from '../../models'
import { CustomerData } from '../../models/customer.model'
import { Vehicle } from '../../models/vehicles.model'
import { PlatformContainer } from '../../styles/Maps'
import { api, capitalizeWords, handleError } from '../../utils'

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
  const [center, setCenter] = useState<{ lat: number; lng: number }>()
  const [filter, setFilter] = useState('')
  const [condition, setCondition] = useState('')
  const [parameter, setParameter] = useState('')
  const [useVehicles, setUseVehicles] = useState<Vehicle[]>([])
  const [zoom, setZoom] = useState(6)

  const toggleActive = (customer: CustomerData) => {
    if (customer.id === customerId) {
      setCustomerId('')
    } else {
      setCustomerId(customer.id)
    }
  }

  const toggleCenter = (vehicle: Vehicle, zoom?: number) => {
    if (vehicle) {
      if (vehicle.device) {
        const device = vehicle.device
        setCenter({
          lat: device.location[0].latitude,
          lng: device.location[0].longitude,
        })
        setZoom(zoom ?? 12)
      }
    }
  }

  const handleClear = () => {
    setCustomerId('')
    setUseVehicles([])
    setFilter('')
    setCondition('')
    setParameter('')
    const location: Location = {
      active: true,
      cellId: '',
      course: '',
      createAt: new Date(Date.now()),
      deleted: false,
      deviceId: '',
      fixTime: new Date(),
      id: '',
      lac: 0,
      latitude: -3.8580372,
      longitude: -38.495503,
      mcc: 0,
      mnc: 0,
      satellite: 0,
      serverTime: new Date(Date.now()),
      speed: 0,
      updateAt: new Date(Date.now()),
    }

    const zeroCenter: Vehicle = {
      active: true,
      branchId: '',
      brand: '',
      chassi: '',
      color: '',
      createAt: new Date(Date.now()).toISOString(),
      customerId: '',
      deleted: false,
      deviceId: '',
      id: '',
      licensePlate: '',
      model: '',
      observation: '',
      renavam: '',
      type: '',
      updateAt: new Date(Date.now()).toISOString(),
      year: new Date(Date.now()).getFullYear(),
      device: {
        location: [location],
        active: true,
        alert: [],
        chipNumber: '',
        code: 0,
        createAt: new Date().toISOString(),
        deleted: false,
        description: '',
        equipmentNumber: '',
        id: '',
        mobileOperator: MobileOperator.Outras,
        model: Model.GT06,
        note: '',
        phone: '',
        status: [],
        timezone: Timezone.GMT_3,
        updateAt: new Date().toISOString(),
      },
    }
    toggleCenter(zeroCenter, 6)
  }

  const { data: customers } = useAxios<CustomerData[]>('customers', {})
  const { data: vehicles } = useAxios<Vehicle[]>(
    `vehicles?where={"customerId":"${customerId}"}`,
    {}
  )

  useEffect(() => {
    if (vehicles) {
      setUseVehicles(vehicles)
    }
  }, [vehicles])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (condition && filter && parameter) {
        api
          .get('vehicles', {
            params: {
              where: {
                [filter]: {
                  [condition]: parameter,
                },
              },
            },
          })
          .then(({ data }: AxiosResponse<Vehicle[]>) => {
            setUseVehicles(data)
          })
          .catch((e: AxiosError) => {
            handleError(e)
          })
      }
    }, 500)

    return () => clearTimeout(timeOut)
  }, [condition, filter, parameter])

  if (!customers) {
    return <Loading />
  }

  return (
    <PlatformContainer>
      <Head title="Plataforma" />
      <Menu config={configMenu} />
      <Pane display="flex">
        <Pane about="customers" width="20vw" height="70vh">
          <Table borderRadius="none">
            <Table.Head height="3vh">
              <Table.TextHeaderCell
                maxWidth="25%"
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
                    maxWidth="25%"
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
          <MapWithNoSSR
            vehicles={customerId && useVehicles ? useVehicles : []}
            center={center}
            zoom={zoom}
          />
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
            <Select
              width="100%"
              height="3vh"
              onChange={e => setFilter(e.target.value)}
              value={filter}
            >
              <option value=""></option>
              {filterConfig.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Pane>
          <Pane {...paneRowFilters} width="10%">
            <Select
              width="100%"
              height="3vh"
              onChange={e => setCondition(e.target.value)}
              value={condition}
            >
              <option value=""></option>
              {conditionsConfig.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Pane>
          <Pane {...paneRowFilters} width="20%">
            <TextInput
              placeholder="Digite um parâmetro"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParameter(e.target.value)
              }
              value={parameter}
            />
          </Pane>
          <Pane {...paneRowFilters} width="7%">
            <Tooltip content="Limpar">
              <IconButton
                width="33%"
                height="3vh"
                icon={CleanIcon}
                onClick={handleClear}
              />
            </Tooltip>
            <Tooltip content="Filtro">
              <IconButton width="33%" height="3vh" icon={FilterIcon} />
            </Tooltip>
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
            <Tooltip content="Atualizar">
              <IconButton width="33%" height="3vh" icon={RefreshIcon} />
            </Tooltip>
            <Tooltip content="Exportar">
              <IconButton width="33%" height="3vh" icon={ExportIcon} />
            </Tooltip>
            <Tooltip content="Abrir no Mapa">
              <IconButton width="33%" height="3vh" icon={MapIcon} />
            </Tooltip>
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
            {(customerId && useVehicles) || useVehicles ? (
              useVehicles.map(vehicle => (
                <Table.Row
                  key={vehicle.id}
                  isSelectable
                  onClick={() => toggleCenter(vehicle)}
                >
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
                          vehicle.device?.status[0]?.ignition ? 'green' : 'gray'
                        }
                      />
                    ) : (
                      ''
                    )}
                  </Table.TextCell>
                </Table.Row>
              ))
            ) : (
              <Pane
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                height={70}
                marginTop={20}
                opacity={0.3}
              >
                <Empty />
              </Pane>
            )}
          </Table.VirtualBody>
        </Table>
      </Pane>
    </PlatformContainer>
  )
}

export default Platform
