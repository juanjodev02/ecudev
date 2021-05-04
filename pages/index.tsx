import { Heading, Button } from '@chakra-ui/react'
import Link from 'next/link'

const IndexPage = () => (
  <>
    <Heading fontSize="6xl">
      ¡Bienvenido!
    </Heading>
    <Link href='/signin'>
      <Button>Login</Button>
    </Link>
  </>
)

export default IndexPage
