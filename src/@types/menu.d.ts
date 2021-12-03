export interface Itens {
  name: string
  select: string
}

export interface MenuItemProps {
  icon?: false | JSX.Element | React.ElementType<unknown> | null | undefined
  itens?: Itens[]
}

export interface ConfigMenu {
  name: string
  itens?: Itens[]
}

export interface MenuProps {
  config: ConfigMenu[]
}
