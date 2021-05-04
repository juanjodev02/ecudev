import {
  Link as ChakraLink,
  Box,
  VStack,
  Text,
  useColorModeValue,
  Center
} from '@chakra-ui/react'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { SigninForm } from '../components/SigninForm'
import { getLoginSession } from '../lib/auth'
import prisma from '../lib/db'

export async function getServerSideProps ({ req }: GetServerSidePropsContext) {
  let session = null
  if (req) session = await getLoginSession(req)
  if (session) {
    await prisma.user.findFirst({ where: { id: session.id } })
    return {
      redirect: {
        destination: '/app',
        permanent: false
      }
    }
  } else {
    return { props: {} }
  }
}

function SignIn () {
  const bg = useColorModeValue('gray.50', 'black')
  const color = useColorModeValue('dark', 'light')

  return (
      <Center height='100%' flexDirection='column'>
        <VStack spacing='1em'>
          <Box bg={bg} color={color} borderWidth="1px" borderRadius="lg" w={[400, 400, 450]} padding='20px' display='block'>
              <Center>
                <Text fontSize="4xl" colorScheme='teal'>Inicia sesión</Text>
              </Center>
              <SigninForm />
          </Box>
          <Box>
            <Text>¿Aún no tienes cuenta? <Link href='/signup'><ChakraLink>crea la tuya aquí </ChakraLink></Link></Text>
          </Box>
        </VStack>
      </Center>
  )
}

export default SignIn
