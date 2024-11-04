'use client'
import clsx from 'clsx'
import { ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
export default function AuthErrorElement({ error }: { error: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    return error ? setIsVisible(true) : setIsVisible(false)
  }, [error])
  return (
    <div
      className={clsx(
        'mt-2 px-1 py-2 text-xs font-semibold border-0 flex items-start justify-start gap-2 transform transition-all duration-100 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <ShieldAlert className='h-4 w-4 mt-[1px] text-red-500' />
      <p className=' text-red-500'>{error}</p>
    </div>
  )
}
