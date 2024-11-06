'use client'
import CodeVerification from '@/components/auth/CodeVerification'
import SignUp from '@/components/auth/SignUp'
import { useSignUp, useUser } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useUser()
  const router = useRouter()

  const [error, setError] = useState('')
  const [pendingVerfication, setPendingVerfication] = useState(false)

  // If the Clerk SDK is not loaded, return null to avoid rendering anything
  if (!isLoaded) return

  // If the user is already signed in, redirect them to the home page
  if (isSignedIn) {
    router.push('/')
    return
  }

  // Function to handle Google sign-up
  const handleGoogleSignUp = async () => {
    if (!isLoaded) return
    try {
      // Use the Clerk SDK to authenticate with Google and redirect the user
      await signUp.authenticateWithRedirect({
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

  // Function to handle email sign-up
  const handleEmailSignUp = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    if (!isLoaded) return null
    try {
      // Use the Clerk SDK to create a new user with email and password
      await signUp.create({
        emailAddress: email,
        password: password,
      })
      // Prepare email address verification
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      // Set the pending verification flag
      setPendingVerfication(true)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        return
      }
      console.log(JSON.stringify(err, null, 2))
    }
  }

  // Function to handle code verification
  const handleCodeVerification = async ({ code }: { code: string }) => {
    if (!isLoaded) return null
    try {
      // Use the Clerk SDK to attempt email address verification
      const signUpStatus = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (signUpStatus.status !== 'complete') {
        console.log(JSON.stringify(signUpStatus, null, 2))
      }

      if (signUpStatus.status === 'complete') {
        // Set the active session to the newly created session (user is now signed in)
        await setActive({ session: signUpStatus.createdSessionId })
        // Reset the pending verification flag
        setPendingVerfication(false)
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

  return !pendingVerfication ? (
    <SignUp
      handleGoogleSignUp={handleGoogleSignUp}
      handleEmailSignUp={handleEmailSignUp}
      error={error}
    />
  ) : (
    <CodeVerification handleCodeVerification={handleCodeVerification} />
  )
}
