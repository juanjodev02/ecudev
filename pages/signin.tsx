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
import { getViewer } from '../lib/api'

export async function getServerSideProps ({ req }: GetServerSidePropsContext) {
  const user = await getViewer(req)
  if (user) {
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
      <Center flexDirection='column' height='100%'>
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
