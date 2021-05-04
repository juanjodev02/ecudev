import Link from 'next/link'
import { Loading } from '../../components/Loading'
import { getLoginSession } from '../../lib/auth'
import prisma from '../../lib/db'
import { User } from 'prisma'
import { GetServerSidePropsContext } from 'next'

export async function getServerSideProps ({ req } : GetServerSidePropsContext) {
  let session = null
  if (req) session = await getLoginSession(req)
  if (session) {
    const user = await prisma.user.findFirst({ where: { id: session.id } })
    return { props: { user } }
  } else {
    return {
      redirect: {
        destination: '/app',
        permanent: false
      }
    }
  }
}

type props = {
  user: User
}

const App = ({ user }: props) => {
  if (user) {
    return (
      <div>
        You are signed in as {user.username} goto{' '}
        <Link href="/about">
          <a>about</a>
        </Link>{' '}
        page. or{' '}
        <Link href="/signout">
          <a>signout</a>
        </Link>
      </div>
    )
  }

  return <Loading />
}

export default App
