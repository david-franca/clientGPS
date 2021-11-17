import type { NextPage } from 'next'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`
const Menu = styled.div`
  grid-area: 1 / 1 / 2 / 13;
  background: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Nav = styled.div`
  grid-area: 2 / 1 / 9 / 4;
  background: whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Map = styled.div`
  grid-area: 2 / 4 / 9 / 13;
  background: violet;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Table = styled.div`
  grid-area: 9 / 1 / 13 / 13;
  background: wheat;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Home: NextPage = () => {
  return (
    <Container>
      <Menu>
        <select name="menu" id="menu">
          <option value="">Selecione</option>
        </select>
        <select name="menu" id="menu">
          <option value="">Selecione</option>
        </select>
        <select name="menu" id="menu">
          <option value="">Selecione</option>
        </select>
      </Menu>
      <Nav>Nav</Nav>
      <Map>Map</Map>
      <Table>Table</Table>
    </Container>
  )
}

export default Home
