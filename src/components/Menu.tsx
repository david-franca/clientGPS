import { Menu } from 'evergreen-ui'

interface MenuItemProps {
  icon?: false | JSX.Element | React.ElementType<unknown> | null | undefined
  itens: string[]
}

export const MenuComponent: React.FC<MenuItemProps> = ({ icon, itens }) => {
  return (
    <Menu>
      <Menu.Group>
        {itens.map((item, index) => (
          <Menu.Item icon={icon} key={index}>
            {item}
          </Menu.Item>
        ))}
      </Menu.Group>
    </Menu>
  )
}
