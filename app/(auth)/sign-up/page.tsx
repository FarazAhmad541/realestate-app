'use client'
import CodeVerification from '@/components/auth/CodeVerification'
import SignUp from '@/components/auth/SignUp'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [pendingVerfication, setPendingVerfication] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const handleCodeVerification = async (code: string) => {
    if (!isLoaded) return null
    setIsLoading(true)
    try {
      const signUpStatus = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (signUpStatus.status !== 'complete') {
        console.log(JSON.stringify(signUpStatus, null, 2))
      }

      if (signUpStatus.status === 'complete') {
        await setActive({ session: signUpStatus.createdSessionId })
        setPendingVerfication(false)
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  return !pendingVerfication ? (
    <SignUp
      handleGoogleSignUp={handleGoogleSignUp}
      handleEmailSignUp={handleEmailSignUp}
      isLoading={isLoading}
    />
  ) : (
    <CodeVerification
      handleCodeVerification={handleCodeVerification}
      isLoading={isLoading}
    />
  )
}
