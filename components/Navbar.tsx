'use client'
import { useUser } from '@clerk/nextjs'
import { House } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser()
  if (!isLoaded) {
    return null
  }

  const email = user?.primaryEmailAddress?.toString()
  return (
    <div className='flex justify-between items-center w-screen h-20 bg-white'>
      <House />
      {isSignedIn ? <>{email}</> : <Link href='/sign-in'>Sign in</Link>}
      
    </div>
  )
}
