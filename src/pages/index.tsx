import type { NextPage } from 'next'
import styled from 'styled-components'

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
`

const Home: NextPage = () => {
  return <Title>Hello World</Title>
}

export default Home
