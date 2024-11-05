'use client'
import { clsx } from 'clsx'

import { ChevronLeft, LoaderCircle, MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Props = {
  generateCode: (email: string) => void
}

//Reset Code generation is done now Implement the functionality to enter new password

export default function ResetPassword({ generateCode }: Props) {
  const [email, setEmail] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    if (!email) {
      alert('Please fill in all fields')
      return
    }
    generateCode(email)
    setIsLoading(false)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center justify-center min-h-screen p-2 md:p-0 lg:p-0'>
      <div className='w-full h-full hidden md:block lg:block md:col-span-2 lg:col-span-4 bg-[url("/images/sign-up-background.jpg")] bg-cover bg-no-repeat '></div>
      <div className='col-span-1 md:col-span-4 lg:col-span-8 flex flex-col justify-center items-center p-4 relative h-full gap-5'>
        <Link
          href='/'
          className='px-4 py-1 border-[1px] rounded-md text-black flex justify-center items-center gap-4 absolute top-4 left-0'
        >
          <MoveLeft className='h-6 w-6' />
          Home
        </Link>
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
                    onChange={(e) => setEmail(e.target.value)}
                    className={clsx('mt-1')}
                    placeholder='Enter your email'
                  />
                </div>
              </div>

              <div>
                <Button
                  type='submit'
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className='mr-2 animate-spin' /> Submit ...
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
      </div>
    </div>
  )
}
