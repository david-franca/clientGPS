import { Button, Menu as MenuUi, Pane, Popover, Position } from 'evergreen-ui'
import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'

interface Itens {
  name: string
  select: string
}

interface MenuItemProps {
  icon?: false | JSX.Element | React.ElementType<unknown> | null | undefined
  itens: Itens[]
}

interface MenuProps {
  config: [{ name: string; itens: Itens[] }]
}

export const Menu: React.FC<MenuProps> = ({ config }) => {
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
        {itens.map((item, index) => (
          <MenuUi.Item
            icon={icon}
            key={index}
            onSelect={e => handleClick(e, item.select)}
          >
            {item.name}
          </MenuUi.Item>
        ))}
      </MenuUi.Group>
    </MenuUi>
  )
}
