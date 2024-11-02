'use client'
import CodeVerification from '@/components/auth/CodeVerification'
import SignUp from '@/components/auth/SignUp'
import { useSignUp } from '@clerk/nextjs'
import { useState } from 'react'

export default function Page() {
  const { isLoaded, signUp } = useSignUp()
  const [pendingVerfication, setPendingVerfication] = useState(true)

  if (!isLoaded) return null

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return null
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleEmailSignUp = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    if (!isLoaded) return null
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      })
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      setPendingVerfication(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleCodeVerification = async (code: string) => {
    console.log(code)
  }

  return !pendingVerfication ? (
    <SignUp
      handleGoogleSignUp={handleGoogleSignUp}
      handleEmailSignUp={handleEmailSignUp}
    />
  ) : (
    <CodeVerification handleCodeVerification={handleCodeVerification} />
  )
}
