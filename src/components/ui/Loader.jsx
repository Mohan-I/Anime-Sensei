import { useState } from 'react'

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);
  return (
      <div className="relative h-dvh w-screen overflow-x-hidden">
        {isLoading && (
            <div className='flex-center absolute z-[100] h-dvh w-screen  overflow-hidden bg-violet-50'>
                <div className='three-body'>
                    <div className='three-body__dot' />
                    <div className='three-body__dot' />
                    <div className='three-body__dot' />
                </div>
            </div>
        )}
        </div>
  )
}

export default Loader
