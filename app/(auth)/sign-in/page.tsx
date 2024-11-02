'use client'
import SignIn from '@/components/auth/SignIn'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return null
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleEmailSignIn = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    if (!isLoaded) return null
    setIsLoading(true)
    try {
      const signInStatus = await signIn.create({ identifier: email, password })
      if (signInStatus.status !== 'complete') {
        console.log(JSON.stringify(signInStatus, null, 2))
      }

      if (signInStatus.status === 'complete') {
        await setActive({ session: signInStatus.createdSessionId })
        router.push('/')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <SignIn
      isLoading={isLoading}
      handleGoogleSignIn={handleGoogleSignIn}
      handleEmailSignIn={handleEmailSignIn}
    />
  )
}
