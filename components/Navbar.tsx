'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClerk, useUser } from '@clerk/nextjs'
import { House, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { signOut } = useClerk()

  const pathname = usePathname()
  const isPublicRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
  if (isPublicRoute) {
    return null
  }

  const handleSignOut = async () => {
    // Implement sign out logic here
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
  }

  if (!isLoaded || isSigningOut) {
    return (
      <nav className='flex items-center justify-between p-4 bg-background shadow-sm'>
        <div className='flex items-center space-x-2'>
          <House className='h-6 w-6 text-primary' />
          <span className='text-xl font-semibold text-primary'>Dream</span>
        </div>
      </nav>
    )
  }

  return (
    <nav className='flex items-center justify-between p-4 bg-background shadow-sm'>
      <div className='flex items-center space-x-2'>
        <House className='h-6 w-6 text-primary' />
        <span className='text-xl font-semibold text-primary'>Dream</span>
      </div>
      {!user ? (
        <Link
          href='/sign-in'
          className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md'
        >
          Sign In
        </Link>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback>
                  {user?.emailAddresses?.toString()[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuItem className='flex-col items-start'>
              <div className='text-xs font-medium text-muted-foreground'>
                Signed in as
              </div>
              <div className='text-sm font-medium truncate'>
                {user?.emailAddresses?.toString()}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link href=''>
                <User className='mr-2 h-4 w-4' />
                <span>User Page</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleSignOut}
              className='cursor-pointer'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  )
}
