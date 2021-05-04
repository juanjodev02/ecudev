import { AuthenticationError, UserInputError, ApolloError } from 'apollo-server-micro'
import bcrypt from 'bcrypt'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/authCookies'
import prisma from '../lib/db'

const validatePassword = async (plainPassword: string, encryptedPassword: string) => {
  return bcrypt.compare(plainPassword, encryptedPassword)
}

export const resolvers = {
  Query: {
    async viewer (_parent: any, _args: any, context: any, _info: any) {
      try {
        let session = null
        if (context.req) session = await getLoginSession(context.req)
        if (session) {
          const user = await prisma.user.findFirst({ where: { id: session.id } })
          return { ...user }
        } else {
          return null
        }
      } catch (error) {
        console.log(error)
        throw new AuthenticationError(
          'Authentication token is invalid, please log in'
        )
      }
    }
  },
  Mutation: {
    async signUp (_parent: any, args: any, _context: any, _info: any) {
      try {
        const encryptedPassword = await bcrypt.hash(args.input.password, 10)
        const newUser = await prisma.user.create({
          data: {
            username: args.input.username,
            facebook: 'undefined',
            twitter: 'undefined',
            github: 'undefined',
            auth: {
              create: {
                email: args.input.email,
                password: encryptedPassword
              }
            }
          }
        })
        return { user: { ...newUser } }
      } catch (error) {
        console.error(error)
        throw new ApolloError('Internal error, please try it again')
      }
    },
    async signIn (_parent: any, args: any, context: any, _info: any) {
      try {
        const userAuth = await prisma.auth.findFirst({ where: { email: args.input.email } })
        if (userAuth) {
          const user = await prisma.user.findFirst({ where: { id: userAuth.ProfileId } })
          const validPassword = await validatePassword(args.input.password, userAuth.password)
          if (validPassword) {
            const session = {
              id: user?.id,
              email: userAuth.email
            }
            await setLoginSession(context.res, session)
            return { user: { ...user } }
          }
        }
      } catch (error) {
        console.error(error)
        throw new UserInputError('Correo o contraseña inválida')
      }
      throw new UserInputError('Correo o contraseña inválida')
    },
    async signOut (_parent: any, _args: any, context: any, _info: any) {
      removeTokenCookie(context.res)
      return true
    }
  }
}
