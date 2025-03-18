import React from 'react'
import {
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
import { AppSidebar } from './app-sidebar'
const DashboardLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=' w-full'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout