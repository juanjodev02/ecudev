import Link from 'next/link'
import { Loading } from '../../components/Loading'
import { User } from 'prisma'
import { GetServerSidePropsContext } from 'next'
import { getViewer } from '../../lib/api'

export async function getServerSideProps ({ req } : GetServerSidePropsContext) {
  const user = await getViewer(req)
  if (user) {
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
