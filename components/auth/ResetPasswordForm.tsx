import { ChevronLeft, EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import AuthErrorElement from './AuthErrorElement'
import CodeVerification from './CodeVerification'

type Props = {
  resetPassword: ({
    code,
    password,
  }: {
    code: string
    password?: string
  }) => Promise<void>
  error: string
  setError: (error: string) => void
}

export default function SignUp({ resetPassword, error, setError }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Check if passwords match
    if (password === confirmPassword) {
      setPasswordsMatch(true)
    } else {
      setPasswordsMatch(false)
    }
  }, [password, confirmPassword])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await resetPassword({ code, password })
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col justify-center items-start gap-5'>
      <div className='w-[400px] h-fit bg-white rounded-xl p-8 shadow-xl'>
        <CodeVerification type='reset-password' setCode={setCode} />
        <div className='text-start'>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-indigo-600'>
            Enter New Password
          </h2>
        </div>
        <form
          className='mt-8 space-y-6'
          action='submit'
          onSubmit={handleSubmit}
        >
          <div className='space-y-4'>
            <div>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setError('')
                    setPassword(e.target.value)
                  }}
                  className='pr-10'
                  placeholder='Enter new password'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-4 w-4 text-gray-500' />
                  ) : (
                    <EyeIcon className='h-4 w-4 text-gray-500' />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor='confirm-password'>Confirm Password</Label>
              <Input
                id='confirm-password'
                name='confirm-password'
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setError('')
                  setConfirmPassword(e.target.value)
                }}
                className={` ${
                  confirmPassword &&
                  (passwordsMatch
                    ? ' focus-visible:ring-green-500'
                    : ' focus-visible:ring-red-300')
                }`}
                placeholder='Confirm new password'
              />
            </div>
            {error && <AuthErrorElement error={error} />}
          </div>

          <div>
            <Button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold'
              disabled={code === '' || isLoading}
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
