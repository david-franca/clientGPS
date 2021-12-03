import 'antd/dist/antd.css'

import { Fragment } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import theme from '../styles/theme'

import type { AppProps } from 'next/app'
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Fragment>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Fragment>
  )
}
