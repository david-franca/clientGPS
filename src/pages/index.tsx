import type { NextPage } from 'next'
import { Layout, Menu, Table } from 'antd'

import { configMenu } from '../config'

const { Content, Sider } = Layout
const { SubMenu } = Menu

const columns = [
  {
    title: 'Placa',
    dataIndex: 'placa',
    key: 'placa',
  },
  {
    title: 'Motorista',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Ultima Atualização',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Velocidade',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Status',
    key: 'action',
  },
]

const Home: NextPage = () => {
  const handleClick = (e: unknown) => {
    console.log('click ', e)
  }

  return (
    <Layout>
      <Menu mode="horizontal" onClick={handleClick}>
        {configMenu.map((data, index) => {
          const key = index + 1
          return (
            <SubMenu key={`menu_${key}`} title={data.name}>
              {data.itens
                ? data.itens.map((item, index) => (
                    <Menu.Item key={index}>{item.name}</Menu.Item>
                  ))
                : ''}
            </SubMenu>
          )
        })}
      </Menu>
      <Layout>
        <Sider style={{ color: '#fff', height: '70vh', background: '#3ba0e9' }}>
          Sider
        </Sider>
        <Content style={{ padding: '0 50px', background: '#3baa' }}>
          <div className="site-layout-content">Mapa</div>
        </Content>
      </Layout>
      <Table columns={columns} />
    </Layout>
  )
}

export default Home
