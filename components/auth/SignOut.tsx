'use client'
import { useClerk } from '@clerk/nextjs'
import { Button } from '../ui/button'
export default function SignOut() {
  const { signOut } = useClerk()
  return <Button onClick={() => signOut()}>Sign Out</Button>
}
