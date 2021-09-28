import {
  Button,
  ButtonProps,
  Pane,
  PaneProps,
  Popover,
  Position,
} from 'evergreen-ui'
import { NextPage } from 'next'
import { MenuComponent } from '../../components/Menu'

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
}

const popoverOptions = {
  minWidth: 5,
  position: Position.BOTTOM_LEFT,
}

const Platform: NextPage = () => {
  return (
    <Pane>
      <Pane width={'100vw'} height={'3vh'} flex={1}>
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
      <Pane flex={1} display="flex">
        <Pane
          width={'25vw'}
          height={'70vh'}
          background="purple600"
          {...centralOption}
        >
          Nav
        </Pane>
        <Pane
          width={'75vw'}
          height={'70vh'}
          color="white"
          background="gray800"
          {...centralOption}
        >
          Mapa
        </Pane>
      </Pane>
      <Pane
        width={'100vw'}
        height={'27vh'}
        background="green300"
        flex={1}
        {...centralOption}
      >
        Tabela
      </Pane>
    </Pane>
  )
}

export default Platform
