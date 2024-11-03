'use client'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { useClerk } from '@clerk/nextjs'
export default function Home() {
  const { signOut } = useClerk()
  return (
    <div>
      <Navbar />
      Home
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}
