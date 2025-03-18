"use client";
import { Button } from "@/components/ui/button";
import {signIn} from "next-auth/react"
import React from 'react'

const Login = () => {
  return (
    <div className=" h-screen w-full flex justify-center items-center flex-col">
      <h1 className=" text-2xl font-extrabold mb-2">
        تسجيل الدخول
      </h1>
        <Button onClick={() => {
            signIn("google")
        }}>
            تسجيل الدخول
        </Button>
    </div>
  )
}

export default Login