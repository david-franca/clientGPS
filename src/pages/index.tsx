import type { NextPage } from 'next'
import { Col, List, Menu, Row, Table } from 'antd'

import { configMenu } from '../config'

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

const data = [
  'David',
  'Carlos',
  'Sara',
  'Alice',
  'Ferreira',
  'Juvenal',
  'Rocha',
  'Carneiro',
  'Ravi',
  'Augusta',
]

const Home: NextPage = () => {
  const handleClick = (e: unknown) => {
    console.log('click ', e)
  }

  return (
    // <Layout>
    //   <Layout>
    //     <Sider style={{ color: '#fff', height: '70vh', background: '#3ba0e9' }}>
    //       Sider
    //     </Sider>
    //     <Content style={{ padding: '0 50px', background: '#3baa' }}>
    //       <div className="site-layout-content">Mapa</div>
    //     </Content>
    //   </Layout>
    //   <Table columns={columns} />
    // </Layout>
    <div>
      <Row>
        <Col span={24}>
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
        </Col>
      </Row>
      <Row>
        <Col span={5}>
          <List
            size="small"
            header={<div>Clientes</div>}
            bordered
            dataSource={data}
            grid={{ column: 1 }}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col span={19}>col-12</Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table columns={columns} />
        </Col>
      </Row>
    </div>
  )
}

export default Home
