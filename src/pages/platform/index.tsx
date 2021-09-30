import {
  Button,
  ButtonProps,
  Checkbox,
  CleanIcon,
  Combobox,
  ExportIcon,
  FilterIcon,
  IconButton,
  MapIcon,
  Pane,
  PaneProps,
  Popover,
  Position,
  RefreshIcon,
  SearchInput,
  Table,
  Text,
  TickIcon,
} from 'evergreen-ui'
import { NextPage } from 'next'
import Lottie from 'react-lottie'

import { MenuComponent } from '../../components/Menu'
import { customers, vehicles } from '../../db'
import { capitalizeWords } from '../../utils'
import worldMap from '../../animations/world-map.json'

const centralOption: PaneProps = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

const buttonOptions: ButtonProps = {
  height: '3vh',
  border: 'Menu',
  borderRadius: 0,
  paddingX: '0.7em',
  size: 'small',
  fontSize: '0.8em',
  background: 'Menu',
  color: 'MenuText',
}

const paneRowFilters: PaneProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
}

const popoverOptions = {
  minWidth: 5,
  position: Position.BOTTOM_LEFT,
}

const Platform: NextPage = () => {
  return (
    <Pane>
      <Pane
        about="menu"
        width={'100vw'}
        flex={1}
        border={true}
        backgroundColor="Menu"
      >
        <Popover
          content={
            <MenuComponent
              itens={[
                'Cliente',
                'Equipamento',
                'Motorista',
                'Veiculo',
                'Filial',
              ]}
            />
          }
          {...popoverOptions}
        >
          <Button {...buttonOptions}>Cadastros</Button>
        </Popover>
        <Popover
          content={
            <MenuComponent
              itens={[
                'Alertas',
                'Entradas',
                'Hodômetro',
                'Relação de Veículos',
                'Relação de Filiais',
              ]}
            />
          }
          {...popoverOptions}
        >
          <Button {...buttonOptions}>Relatórios</Button>
        </Popover>
        <Popover
          content={
            <MenuComponent
              itens={[
                'Cliente',
                'Equipamento',
                'Motorista',
                'Veiculo',
                'Filial',
              ]}
            />
          }
          {...popoverOptions}
        >
          <Button {...buttonOptions}>Configurações</Button>
        </Popover>
      </Pane>
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
                  onSelect={() => alert(customer.cpfOrCnpj)}
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
        <Pane about="map" width="80vw" height="70vh" {...centralOption}>
          <Lottie
            options={{ loop: true, autoplay: true, animationData: worldMap }}
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
            <IconButton width="33%" height="3vh" icon={CleanIcon} />
            <IconButton width="33%" height="3vh" icon={FilterIcon} />
          </Pane>
          <Pane {...paneRowFilters} width="15%">
            <Text paddingRight={6}>Atualização:</Text>
            <Combobox
              initialSelectedItem={{ label: 'Não atualizar' }}
              items={[
                { label: 'Não atualizar' },
                { label: '30 segundos' },
                { label: '1 minuto' },
                { label: '2 minutos' },
                { label: '3 minutos' },
                { label: '5 minutos' },
                { label: '10 minutos' },
              ]}
              itemToString={(item) => (item ? item.label : '')}
              width="100%"
              height="3vh"
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
              itemToString={(item) => (item ? item.label : '')}
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
            <Table.TextHeaderCell>Frota</Table.TextHeaderCell>
            <Table.TextHeaderCell>Motorista</Table.TextHeaderCell>
            <Table.TextHeaderCell>Última Atualização</Table.TextHeaderCell>
            <Table.TextHeaderCell>Velocidade</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height="20vh">
            {vehicles.map((vehicle) => (
              <Table.Row key={vehicle.id} isSelectable>
                <Table.TextCell>{vehicle.licensePlate}</Table.TextCell>
                <Table.TextCell></Table.TextCell>
                <Table.TextCell></Table.TextCell>
                <Table.TextCell>{vehicle.updateAt}</Table.TextCell>
                <Table.TextCell></Table.TextCell>
                <Table.TextCell></Table.TextCell>
              </Table.Row>
            ))}
          </Table.VirtualBody>
        </Table>
      </Pane>
    </Pane>
  )
}

export default Platform
