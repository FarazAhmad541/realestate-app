import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type Props = {
  resetPassword: ({ password }: { password?: string }) => void
}

export default function SignUp({ resetPassword }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await resetPassword({ password })
    setIsLoading(false)
  }

  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordsMatch(true)
    } else {
      setPasswordsMatch(false)
    }
  }, [password, confirmPassword])

  return (
    <div className='w-[400px] h-fit bg-white rounded-xl p-8 shadow-xl'>
      <div className='text-start'>
        <h2 className='mt-6 text-3xl font-bold tracking-tight text-indigo-600'>
          Enter New Password
        </h2>
      </div>
      <form className='mt-8 space-y-6' action='submit' onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={` ${
                confirmPassword &&
                (passwordsMatch
                  ? ' focus-visible:ring-green-500'
                  : ' focus-visible:ring-red-300')
              }`}
              placeholder='Confirm new password'
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
                <LoaderCircle className='mr-2 animate-spin' /> Submit
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
