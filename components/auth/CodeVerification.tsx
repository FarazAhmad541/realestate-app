'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function CodeVerification({
  handleCodeVerification,
  isLoading,
}: {
  handleCodeVerification?: (code: string) => void
  isLoading: boolean
}) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [isComplete, setIsComplete] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    setIsComplete(newCode.every((digit) => digit !== ''))
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    const verificationCode = code.join('')
    if (verificationCode.length === 6) {
      handleCodeVerification?.(verificationCode)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full m-auto'>
      <div className='w-full max-w-sm mx-auto space-y-6'>
        <div className='text-center space-y-2'>
          <h2 className='text-3xl font-bold'>Verify Your Code</h2>
          <p className='text-muted-foreground'>
            Enter the verification code we sent to your Email
          </p>
        </div>
        <div className='flex justify-center space-x-2'>
          {code.map((digit, index) => (
            <Input
              key={index}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              className='w-12 h-12 text-center text-2xl'
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          className='w-full bg-indigo-600 hover:bg-indigo-700'
          disabled={!isComplete || isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className='mr-2 animate-spin' /> Verifying...
            </>
          ) : (
            <>Verify</>
          )}
        </Button>
      </div>
    </div>
  )
}
