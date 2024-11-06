import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center justify-center min-h-screen p-2 md:p-0 lg:p-0'>
      <div className='w-full h-full hidden md:block lg:block md:col-span-2 lg:col-span-4 bg-[url("/images/sign-up-background.jpg")] bg-cover bg-no-repeat '></div>
      <div className='col-span-1 md:col-span-4 lg:col-span-8 flex justify-center items-center p-4 relative h-full'>
        <Link
          href='/'
          className='px-4 py-1 border-[1px] rounded-md text-black flex justify-center items-center gap-4 absolute top-4 left-0'
        >
          <MoveLeft className='h-6 w-6' />
          Home
        </Link>
        {children}
      </div>
    </div>
  )
}
