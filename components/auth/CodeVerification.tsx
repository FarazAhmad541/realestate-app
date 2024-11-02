import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

type Props = {
  handleCodeVerification: (code: string) => void
}

const VerificationCodeInput = ({ handleCodeVerification }: Props) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // If a digit was entered, move to the next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
        inputRefs.current[index - 1].focus()
      } else {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      }
    }
    // Handle left arrow
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
    // Handle right arrow
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d*$/.test(pastedData)) return

    const newCode = [...code]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newCode[index] = char
    })
    setCode(newCode)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => digit === '')
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus()
    } else {
      inputRefs.current[5].focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.every((digit) => digit !== '')) {
      handleCodeVerification(code.join(''))
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Verification Code</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='flex justify-between gap-2 mb-6'>
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className='w-12 h-12 text-center text-lg font-semibold'
                autoFocus={index === 0}
              />
            ))}
          </div>
          <Button
            type='submit'
            className='w-full'
            disabled={!code.every((digit) => digit !== '')}
          >
            Verify
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default VerificationCodeInput
