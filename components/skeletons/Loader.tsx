import { Skeleton } from '@/components/ui/skeleton'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center justify-center min-h-screen p-2 md:p-0 lg:p-0'>
      <div className='w-full h-full hidden md:block lg:block md:col-span-2 lg:col-span-4 bg-muted'></div>
      <div className='col-span-1 md:col-span-4 lg:col-span-8 flex justify-center items-center p-4 relative h-full'>
        <Link
          href='/'
          className='px-4 py-1 border-[1px] rounded-md text-muted-foreground flex justify-center items-center gap-4 absolute top-4 left-0'
        >
          <MoveLeft className='h-6 w-6' />
          Home
        </Link>

        <div className='w-[400px] h-fit bg-background rounded-xl p-8 shadow-xl'>
          <div className='text-center'>
            <Skeleton className='h-9 w-3/4 mx-auto mt-6' />
            <Skeleton className='h-5 w-2/3 mx-auto mt-2' />
          </div>
          <div className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <div>
                <Skeleton className='h-5 w-1/3 mb-1' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div>
                <Skeleton className='h-5 w-1/3 mb-1' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>

            <Skeleton className='h-10 w-full' />

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <Skeleton className='h-5 w-1/3 bg-background' />
              </div>
            </div>

            <Skeleton className='h-10 w-full' />
            <div className='text-center mt-4'>
              <Skeleton className='h-5 w-2/3 mx-auto' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
