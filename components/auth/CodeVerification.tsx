'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Define types for component props
type Props = {
  handleCodeVerification?: ({ code }: { code: string }) => void
  type?: 'reset-password' | 'sign-up' // Optional type prop to determine behavior (e.g., reset password or sign-up)
  setCode?: (code: string) => void // Optional callback to set the code value
}

// Component definition for CodeVerification
export default function CodeVerification({
  handleCodeVerification,
  type,
  setCode,
}: Props) {
  const [codeArray, setCodeArray] = useState<string[]>(Array(6).fill('')) // State to manage the 6-digit code input array
  const [isComplete, setIsComplete] = useState(false) // State to track if the code is complete (all digits filled)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]) // Ref to handle input focus
  const [isLoading, setIsLoading] = useState(false) // Loading state for async operations

  // Focus on the first input field when the component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Handle input change for each digit
  const handleChange = (index: number, value: string) => {
    // Only allow numeric values
    if (!/^\d*$/.test(value)) return
    if (type === 'reset-password') {
      setCode?.('') // Clear previous code if type is 'reset-password'
    }

    // Update the code array
    const newCode = [...codeArray]
    newCode[index] = value
    setCodeArray(newCode)

    // Move to the next input if a digit is entered
    if (value && index < codeArray.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all inputs are filled
    setIsComplete(newCode.every((digit) => digit !== ''))
    const verificationCode = newCode.join('')

    // Set the complete code if type is 'reset-password' and all digits are entered
    if (type === 'reset-password' && verificationCode.length === 6) {
      setCode?.(verificationCode)
    }
  }

  // Handle key press events, particularly for navigating with the Backspace key
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus() // Move focus to the previous input if Backspace is pressed
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true) // Set loading state
    const verificationCode = codeArray.join('')

    // Call verification function if the type is 'sign-up' and the code is complete
    if (type === 'sign-up' && verificationCode.length === 6) {
      await handleCodeVerification?.({ code: verificationCode })
    }
    setIsLoading(false) // Reset loading state
  }

  return (
    <div className='flex flex-col items-center justify-center w-full m-auto'>
      <div className='w-full max-w-sm mx-auto space-y-6'>
        <div className='text-start space-y-2'>
          <h2 className='text-3xl font-bold'>Verify Your Code</h2>
          <p className='text-muted-foreground'>
            Enter the verification code we sent to your Email
          </p>
        </div>
        {/* Render input fields for the code array */}
        <div className='flex justify-center space-x-2'>
          {codeArray.map((digit, index) => (
            <Input
              key={index}
              type='text'
              inputMode='numeric'
              maxLength={1} // Limit input length to 1 character
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
        {/* Render verification button if type is 'sign-up' */}
        {type === 'sign-up' && (
          <Button
            onClick={handleSubmit}
            className='w-full bg-indigo-600 hover:bg-indigo-700'
            disabled={!isComplete || isLoading} // Disable button if code is incomplete or loading
          >
            {isLoading ? (
              <>
                <LoaderCircle className='mr-2 animate-spin' /> Verifying...
              </>
            ) : (
              <>Verify</>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
