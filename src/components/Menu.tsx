import { Button, Menu as MenuUi, Pane, Popover, Position } from 'evergreen-ui'
import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'
import { MenuItemProps, MenuProps } from '../@types/menu'

export const Menu: React.FC<MenuProps> = ({ config }) => {
  const router = useRouter()

  const handleClick = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault()
    router.push('/platform')
  }

  return (
    <Pane
      about="menu"
      width={'100vw'}
      flex={1}
      border={true}
      backgroundColor="Menu"
      position="relative"
      height="auto"
    >
      <Button
        height="3vh"
        border="Menu"
        borderRadius={0}
        paddingX="0.7em"
        size="small"
        fontSize="0.8em"
        background="Menu"
        color="MenuText"
        onClick={handleClick}
      >
        Plataforma
      </Button>
      {config.map((component, index) => (
        <Popover
          key={index}
          display="inline-block"
          content={<MenuComponent itens={component.itens} />}
          minWidth={5}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            height="3vh"
            border="Menu"
            borderRadius={0}
            paddingX="0.7em"
            size="small"
            fontSize="0.8em"
            background="Menu"
            color="MenuText"
          >
            {component.name}
          </Button>
        </Popover>
      ))}
    </Pane>
  )
}

const MenuComponent: React.FC<MenuItemProps> = ({ icon, itens }) => {
  const router = useRouter()

  const handleClick = (e: SyntheticEvent<Element, Event>, select: string) => {
    e.preventDefault()
    router.push('/platform/new/' + select)
  }
  return (
    <MenuUi>
      <MenuUi.Group>
        {itens
          ? itens.map((item, index) => (
              <MenuUi.Item
                icon={icon}
                key={index}
                onSelect={e => handleClick(e, item.select)}
              >
                {item.name}
              </MenuUi.Item>
            ))
          : ''}
      </MenuUi.Group>
    </MenuUi>
  )
}
