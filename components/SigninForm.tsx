import { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Formik, Field } from 'formik'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import * as Yup from 'yup'
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  VStack,
  Text,
  useToast
} from '@chakra-ui/react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import { getErrorMessage } from '../lib/form'

const SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
      }
    }
  }
`

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Dirección de correo electrónico no válida').required('Obligatorio'),
  password: Yup.string().required('Hey, no has ingresado la constraseña')
})

export const SigninForm = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState()
  const client = useApolloClient()
  const [signIn, { loading }] = useMutation(SignInMutation)
  const [show, setShow] = useState(false)
  const toast = useToast()

  const handleClick = () => setShow(!show)

  async function handleSubmit ({ email, password }, { setSubmitting }) {
    try {
      await client.resetStore()
      const { data } = await signIn({
        variables: {
          email,
          password
        }
      })
      if (data.signIn.user) {
        setSubmitting(false)
        toast({
          title: 'Hola, nos contenta el verte de nuevo',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        })
        !loading && Promise.resolve(router.push('/app'))
      }
    } catch (error) {
      console.error(error)
      setErrorMsg(getErrorMessage(error))
      await setSubmitting(false)
    }
  }
  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
        >
        {(props) => (
          <Form>
            <VStack spacing='30px' display='flex' alignItems='flex-start'>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <Input {...field} size='lg' variant='filled' id="email" placeholder="example@example.com" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        id="password"
                        pr="4.5rem"
                        type={show ? 'text' : 'password'}
                        placeholder="Contraseña"
                        variant='filled'
                        size='lg'
                      />
                      <InputRightElement height='100%' width="4.5rem" display='flex' justifyContent='center'>
                        {show ? <ViewOffIcon onClick={handleClick} /> : <ViewIcon onClick={handleClick} />}
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme="teal"
                // eslint-disable-next-line react/prop-types
                isLoading={props.isSubmitting}
                type='submit'
              >
                Iniciar Sesión
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
      <Text fontSize='m' color='red.500' mt='5'>{errorMsg}</Text>
    </>
  )
}
