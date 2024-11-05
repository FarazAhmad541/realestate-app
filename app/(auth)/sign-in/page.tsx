'use client'
import SignIn from '@/components/auth/SignIn'
import { useSignIn, useUser } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { isSignedIn } = useUser()

  const router = useRouter()

  if (!isLoaded) return

  if (isSignedIn) {
    router.push('/')
    return
  }

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return null
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        setIsLoading(false)
        return
      }
      console.log(JSON.stringify(err, null, 2))
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
    setError('')
    try {
      const { status, createdSessionId } = await signIn.create({
        identifier: email,
        password,
      })
      if (status !== 'complete') {
        console.log(JSON.stringify(status, null, 2))
      }

      if (status === 'complete') {
        await setActive({ session: createdSessionId })
        router.push('/')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        setIsLoading(false)
        return
      }
      console.log(JSON.stringify(err, null, 2))
    }
    setIsLoading(false)
  }

  return (
    <>
      <SignIn
        isLoading={isLoading}
        handleGoogleSignIn={handleGoogleSignIn}
        handleEmailSignIn={handleEmailSignIn}
        error={error}
        setError={setError}
      />
    </>
  )
}
