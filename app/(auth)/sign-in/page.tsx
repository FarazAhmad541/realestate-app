'use client'
import SignIn from '@/components/auth/SignIn'
import { useSignIn, useUser } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [error, setError] = useState('')

  // If the Clerk SDK is not loaded, return null to avoid rendering anything
  if (!isLoaded) return

  // If the user is already signed in, redirect them to the home page
  if (isSignedIn) {
    router.push('/')
    return
  }

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return null
    try {
      // Use the Clerk SDK to authenticate with Google and redirect the user
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        return
      }
      console.log(JSON.stringify(err, null, 2))
    }
  }

  // Function to handle email sign-in
  const handleEmailSignIn = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    if (!isLoaded) return null
    setError('')
    try {
      // Use the Clerk SDK to sign in with an email and password
      const { status, createdSessionId } = await signIn.create({
        identifier: email,
        password,
      })
      if (status !== 'complete') {
        console.log(JSON.stringify(status, null, 2))
      }

      if (status === 'complete') {
        // Set the active session to the newly created session (user is now signed in)
        await setActive({ session: createdSessionId })
        router.push('/')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        return
      }
      console.log(JSON.stringify(err, null, 2))
    }
  }

  return (
    <>
      <SignIn
        handleGoogleSignIn={handleGoogleSignIn}
        handleEmailSignIn={handleEmailSignIn}
        error={error}
        setError={setError}
      />
    </>
  )
}
