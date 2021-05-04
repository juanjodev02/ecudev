import { ReactNode } from 'react'
import { Container } from './Container'
import { NavBar } from './NavBar'

type Props = {
  children?: ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <Container overflowX='hidden' padding="0 20vw" width='100vw' height='100vh'>
      <NavBar />
      {children}
    </Container>
  )
}
