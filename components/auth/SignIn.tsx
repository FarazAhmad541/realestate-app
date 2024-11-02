import { CredentialsSchema } from '@/lib/definitions'
import { EyeIcon, EyeOffIcon, LoaderCircle, MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type Props = {
  handleGoogleSignIn: () => void
  handleEmailSignIn: ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => void
  isLoading: boolean
}

export default function SignUp({
  handleGoogleSignIn,
  handleEmailSignIn,
  isLoading,
}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }
    try {
      CredentialsSchema.parse({ email, password })
      handleEmailSignIn({ email, password })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center justify-center min-h-screen p-2 md:p-0 lg:p-0'>
      <div className='w-full h-full hidden md:block lg:block md:col-span-2 lg:col-span-4 bg-[url("/static/images/sign-up-background.jpg")] bg-cover bg-no-repeat '></div>
      <div className='col-span-1 md:col-span-4 lg:col-span-8 flex justify-center items-center p-4 relative h-full'>
        <Link
          href='/'
          className='px-4 py-1 border-[1px] rounded-md text-black flex justify-center items-center gap-4 absolute top-4 left-0'
        >
          <MoveLeft className='h-6 w-6' />
          Home
        </Link>

        <div className='w-[400px] h-fit bg-white rounded-xl p-8 shadow-xl'>
          <div className='text-center'>
            <h2 className='mt-6 text-3xl font-bold tracking-tight text-indigo-600'>
              Sign In to Your Account
            </h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Sign in to get started with our service
            </p>
          </div>
          <form
            className='mt-8 space-y-6'
            action='submit'
            onSubmit={handleSubmit}
          >
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email-address'>Email address</Label>
                <Input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='mt-1'
                  placeholder='Enter your email'
                />
              </div>
              <div>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pr-10'
                    placeholder='Enter your password'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className='h-4 w-4 text-gray-500' />
                    ) : (
                      <EyeIcon className='h-4 w-4 text-gray-500' />
                    )}
                  </Button>
                </div>
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
                    <LoaderCircle className='mr-2 animate-spin' /> Signing in
                  </>
                ) : (
                  <>Sign in</>
                )}
              </Button>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                onClick={handleGoogleSignIn}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  x='0px'
                  y='0px'
                  width='150'
                  height='150'
                  viewBox='0 0 48 48'
                  className='w-5 h-5 mr-2'
                >
                  <path
                    fill='#fbc02d'
                    d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                  ></path>
                  <path
                    fill='#e53935'
                    d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                  ></path>
                  <path
                    fill='#4caf50'
                    d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                  ></path>
                  <path
                    fill='#1565c0'
                    d='M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                  ></path>
                </svg>
                Sign in with Google
              </Button>
              <div className='text-center mt-4'>
                <p>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/sign-up'
                    className='text-blue-500 hover:underline'
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
