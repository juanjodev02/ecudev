import { Flex, Box, Stack, Button, Spacer, Heading } from '@chakra-ui/react'
import Link from 'next/link'

import { DarkModeSwitch } from '../components/DarkModeSwitch'

type NavBarLink = {
  name: string,
  ref: string
}

const navBarLinks: NavBarLink[] = [
  {
    name: 'Home',
    ref: '/'
  },
  {
    name: 'About',
    ref: '/about'
  },
  {
    name: 'Posts',
    ref: '/posts'
  }
]

const NavBarOptions = () => {
  return (
    <Stack direction="row" spacing={4} alignItems="center">
      {navBarLinks.map((navBarLink: NavBarLink) => (
        <Link href={navBarLink.ref} key={navBarLink.name}>
          <Button variant="ghost" key={navBarLink.name}>{navBarLink.name}</Button>
        </Link>
      ))}
      <DarkModeSwitch />
    </Stack>
  )
}

export const NavBar = () => {
  return (
    <Flex justifyContent='space-between' width='100%'>
      <Box p="2">
        <Heading size='lg'>ECUDEV</Heading>
      </Box>
      <Spacer />
      <Box>
        <NavBarOptions />
      </Box>
    </Flex>
  )
}
