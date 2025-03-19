"use client";
import { Button } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  // دالة لتحديث عدد المنتجات
  const updateCartCount = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      setCartCount(cartItems.length);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    
    const handleStorageChange = () => updateCartCount();
    
    window.addEventListener('cartUpdated', handleStorageChange);
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className='p-4 shadow-lg fixed backdrop-blur-md z-50 md:rounded-lg w-full md:w-[98%] mx-auto transition-all flex justify-between items-center flex-row'>
      <div className='bg-black rounded-lg p-2 w-[50px] text-white flex justify-center items-center flex-row cursor-pointer'>
        Logo
      </div>
      <Button className='flex justify-center items-center flex-row'>
        <ShoppingBasket />
        <span>{cartCount}</span>
      </Button>
    </div>
  )
}

export default Header;