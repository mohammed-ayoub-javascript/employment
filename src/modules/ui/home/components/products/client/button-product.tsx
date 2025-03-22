"use client";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";
import React, { useEffect, useState } from "react";


interface Product {
  id?: number;
  name: string;
  description: string;
  images: string[] | string ; 
  price: string;
  number: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}



const ButtonProduct = ({ product }: { product: Product }) => {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const updateCartStatus = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setIsInCart(cartItems.some((item: Product) => item.id === product.id));
    };

    updateCartStatus();
    window.addEventListener("cartUpdated", updateCartStatus);

    return () => window.removeEventListener("cartUpdated", updateCartStatus);
  }, [product.id]);

  const handleCartAction = () => {
    let cartItems: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");

    if (isInCart) {
      cartItems = cartItems.filter((item) => item.id !== product.id);
    } else {
      if (!cartItems.some((item) => item.id === product.id)) {
        cartItems.push(product);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    setIsInCart(!isInCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="w-full">
      <Button
        className="w-full"
        onClick={handleCartAction}
        variant={isInCart ? "destructive" : "default"}
      >
        {isInCart ? <X className="h-4 w-4" /> : <ShoppingBag />}
      </Button>
    </div>
  );
};

export default ButtonProduct;
