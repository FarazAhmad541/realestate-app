'use client'
import GenerateResetPasswordCode from '@/components/auth/GenerateResetPasswordCode'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [successFulCreation, setSuccessfulCreation] = useState(false)
  const [error, setError] = useState('')

  // If Clerk SDK is not loaded, return null to avoid rendering anything
  if (!isLoaded) {
    return null
  }

  // If the user is already signed in, redirect them to the home page
  if (isSignedIn) {
    router.push('/')
    return
  }

  // Function to generate a reset password code
  async function generateCode(email: string) {
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  // Function to reset the password
  async function resetPassword({
    code,
    password,
  }: {
    code: string
    password?: string
  }) {
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        if (result.status === 'complete') {
          // Set the active session to the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId })
          setError('')
        } else {
          console.log(result)
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  // Render the appropriate component based on the state
  return (
    <>
      {!successFulCreation && (
        <GenerateResetPasswordCode
          generateCode={generateCode}
          error={error}
          setError={setError}
        />
      )}
      {successFulCreation && (
        <ResetPasswordForm
          resetPassword={resetPassword}
          error={error}
          setError={setError}
        />
      )}
    </>
  )
}
