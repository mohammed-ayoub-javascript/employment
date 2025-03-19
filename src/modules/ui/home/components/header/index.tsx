"use client";
import { Button } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
<div className='  p-4 shadow-lg fixed  backdrop-blur-md z-50 md:rounded-lg w-full md:w-[98%] mx-auto transition-all flex justify-between items-center flex-row'>
  <div className=' bg-black rounded-lg p-2 w-[50px] text-white flex justify-center items-center flex-row cursor-pointer'>Logo</div>
  {/* Categories */}
  {/*  About us here */}
  <Button className=' flex justify-center items-center flex-row'>
    <ShoppingBasket />
    <span>
      0
    </span>
  </Button>
</div>
)
}

export default Header