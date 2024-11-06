'use client'
import CodeVerification from '@/components/auth/CodeVerification'
import GenerateResetPasswordCode from '@/components/auth/GenerateResetPasswordCode'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// There is no separate method present in Clerk SDK to check if the verification code is valid or not.
// Therefore the is redirected to the reset password page even if the code is invalid.
// This is a known issue and will need to be fixed in the future.

export default function Page() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [successFulCreation, setSuccessfulCreation] = useState(false)
  const [code, setCode] = useState('')
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
  async function resetPassword({ password }: { password?: string }) {
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

  // Function to handle the verification code
  function handleCode({ code }: { code: string }) {
    setCode(code)
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
      {successFulCreation &&
        (!code ? (
          <CodeVerification handleCodeVerification={handleCode} />
        ) : (
          <ResetPasswordForm resetPassword={resetPassword} />
        ))}
    </>
  )
}
