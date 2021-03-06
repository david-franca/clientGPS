import { Empty } from 'antd'
import {
  Autocomplete,
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
  Popover,
  RefreshIcon,
  RemoveIcon,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
} from 'evergreen-ui'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { ChangeEvent, useEffect, useState } from 'react'

import { Head, Loading, Menu } from '../../components'
import { conditionsConfig, filterConfig } from '../../config'
import { configMenu } from '../../config/menu.config'
import { useAxios } from '../../hooks/useAxios'
import { CustomerData } from '../../models/customer.model'
import { Vehicle } from '../../models/vehicles.model'
import { PlatformContainer } from '../../styles/Maps'
import { capitalizeWords, zeroCenter } from '../../utils'
import { filterVehicles } from '../../utils/filters.utils'

const { TextCell, TextHeaderCell, Row, VirtualBody } = Table

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshTime, setRefreshTime] = useState<Refresh>(Refresh.DONT)
  const [center, setCenter] = useState<{ lat: number; lng: number }>()
  const [filter, setFilter] = useState('')
  const [condition, setCondition] = useState('')
  const [parameter, setParameter] = useState('')
  const [useVehicles, setUseVehicles] = useState<Vehicle[]>([])
  const [zoom, setZoom] = useState(6)
  const [autocompleteItens, setAutocompleteItens] = useState<Array<string>>([])

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
    toggleCenter(zeroCenter, 6)
  }

  const handleAutocomplete = (value: string) => {
    const v: Vehicle[] = []
    vehicles
      ? vehicles.forEach(vehicle => {
          if (vehicle.licensePlate === value) {
            v.push(vehicle)
          }
        })
      : []
    setUseVehicles(old => [...old, ...v])
  }

  const { data: customers } = useAxios<CustomerData[]>('customers', {})
  const { data: vehicles } = useAxios<Vehicle[]>(`vehicles`, {})

  useEffect(() => {
    if (vehicles && customerId) {
      const vehicle = vehicles.filter(value => value.customerId === customerId)
      setUseVehicles(vehicle)
    }
  }, [customerId, vehicles])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (condition && filter && parameter) {
        if (vehicles) {
          console.log(condition)
          const array: Vehicle[] = filterVehicles(
            vehicles,
            condition,
            parameter
          )
          setUseVehicles(old => [...old, ...array])
        }
      }
    }, 500)

    return () => clearTimeout(timeOut)
  }, [condition, filter, parameter, vehicles])

  useEffect(() => {
    if (condition && filter && vehicles) {
      const filter: string[] = []
      vehicles.forEach(vehicle => {
        filter.push(vehicle.licensePlate)
      })
      setAutocompleteItens(filter)
    }
  }, [condition, filter, vehicles])

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
              <TextHeaderCell
                maxWidth="25%"
                borderRight={true}
              ></TextHeaderCell>
              <TextHeaderCell>Clientes</TextHeaderCell>
            </Table.Head>
            <VirtualBody height="67vh">
              {customers.map((customer, index) => (
                <Row
                  key={customer.id}
                  isSelectable
                  background={customerId === customer.id ? 'green300' : ''}
                  onSelect={() => toggleActive(customer)}
                >
                  <TextCell
                    borderRight={true}
                    textAlign="end"
                    maxWidth="25%"
                    isNumber
                  >
                    {index + 1}
                  </TextCell>
                  <TextCell>{capitalizeWords(customer.fullName)}</TextCell>
                </Row>
              ))}
            </VirtualBody>
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
            {condition == 'equals' ? (
              <Autocomplete
                title="Fruits"
                onChange={changedItem => handleAutocomplete(changedItem)}
                items={autocompleteItens}
              >
                {props => {
                  const { getInputProps, getRef, inputValue } = props
                  return (
                    <TextInput
                      {...getInputProps()}
                      placeholder="Fruits"
                      value={inputValue}
                      ref={getRef}
                    />
                  )
                }}
              </Autocomplete>
            ) : (
              <TextInput
                placeholder="Digite um parâmetro"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setParameter(e.target.value)
                }
                value={parameter}
              />
            )}
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
            <Popover
              content={
                <Pane>
                  <Table width={500} height={150}>
                    <Table.Head height={25}>
                      <TextHeaderCell>Campo</TextHeaderCell>
                      <TextHeaderCell>Condição</TextHeaderCell>
                      <TextHeaderCell>Filtro</TextHeaderCell>
                      <TextHeaderCell></TextHeaderCell>
                    </Table.Head>
                    <VirtualBody height={125}>
                      {useVehicles.map((vehicle, index) => (
                        <Row key={index}>
                          <TextCell></TextCell>
                          <TextCell></TextCell>
                          <TextCell>{vehicle.licensePlate}</TextCell>
                          <TextCell>
                            <IconButton
                              icon={RemoveIcon}
                              //! TODO
                              onClick={() => useVehicles.splice(index, 1)}
                              intent="danger"
                              height={25}
                              border="none"
                            />
                          </TextCell>
                        </Row>
                      ))}
                    </VirtualBody>
                  </Table>
                </Pane>
              }
            >
              <Tooltip content="Filtro">
                <IconButton width="33%" height="3vh" icon={FilterIcon} />
              </Tooltip>
            </Popover>
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
            <TextHeaderCell>Placa</TextHeaderCell>
            <TextHeaderCell>Motorista</TextHeaderCell>
            <TextHeaderCell>Última Atualização</TextHeaderCell>
            <TextHeaderCell>Velocidade</TextHeaderCell>
            <TextHeaderCell>Status</TextHeaderCell>
          </Table.Head>
          <VirtualBody height="20vh">
            {(customerId && useVehicles) || useVehicles ? (
              useVehicles.map(vehicle => (
                <Row
                  key={vehicle.id}
                  isSelectable
                  onClick={() => toggleCenter(vehicle)}
                >
                  <TextCell>{vehicle.licensePlate}</TextCell>
                  <TextCell>{}</TextCell>
                  <TextCell>
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
                  </TextCell>
                  <TextCell>{vehicle.device?.location[0]?.speed}</TextCell>
                  <TextCell>
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
                  </TextCell>
                </Row>
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
          </VirtualBody>
        </Table>
      </Pane>
    </PlatformContainer>
  )
}

export default Platform
