import { Button } from '@/components/ui/button'
import React from 'react'

const Hero = () => {
  return (
<div
  className="w-full h-screen flex justify-center items-center flex-col"
>        <h1 className=' text-6xl font-extrabold text-black'>
            متجر store4dz
        </h1>
        <p className=' text-xl text-gray-950 mt-3'>
            حيث يمكنك شراء كل ما تريده
        </p>
        <Button className=' mt-2' variant={"outline"}>
            تسوق الان
        </Button>
    </div>
  )
}

export default Hero