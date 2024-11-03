'use client'
import CodeVerification from '@/components/auth/CodeVerification'
import SignUp from '@/components/auth/SignUp'
import { useSignUp } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [error, setError] = useState('')

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
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        console.log(JSON.stringify(err, null, 2))
        setError(err.errors[0].message)
        setIsLoading(false)
        return
      }
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
      error={error}
    />
  ) : (
    <CodeVerification
      handleCodeVerification={handleCodeVerification}
      isLoading={isLoading}
    />
  )
}
