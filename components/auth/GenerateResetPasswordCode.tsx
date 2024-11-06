'use client'
import { clsx } from 'clsx'

import { ChevronLeft, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import AuthErrorElement from './AuthErrorElement'

type Props = {
  generateCode: (email: string) => void
  error: string
  setError: (error: string) => void
}

export default function ResetPassword({
  generateCode,

  error,
  setError,
}: Props) {
  const [email, setEmail] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    if (!email) {
      alert('Please fill in all fields')
      return
    }
    await generateCode(email)
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col justify-center items-start gap-5'>
      <div className='w-fit h-fit bg-white rounded-xl p-8 shadow-xl'>
        <div>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-indigo-600'>
            Reset Your Password
          </h2>
          <p>We will send you a code to reset your password</p>
        </div>

        <form
          className='mt-8 space-y-6'
          action='submit'
          onSubmit={handleSubmit}
        >
          <div className='space-y-4'>
            <div>
              <Input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => {
                  setError('')
                  setEmail(e.target.value)
                }}
                className={clsx('mt-1')}
                placeholder='Enter your email'
              />
            </div>
            {error && <AuthErrorElement error={error} />}
          </div>

          <div>
            <Button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className='mr-2 animate-spin' /> Submit
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </div>
        </form>
      </div>

      <button
        onClick={router.back}
        className='text-indigo-600 text-sm hover:underline flex items-center bg-transparent hover:bg-transparent'
      >
        <ChevronLeft className='h-4 w-4 text-indigo-600' />
        Back
      </button>
    </div>
  )
}
