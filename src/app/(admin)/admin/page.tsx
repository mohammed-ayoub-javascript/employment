import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartArea, Plus, ShoppingBag } from 'lucide-react'
import React from 'react'
import { ChartMainApp } from './chart'
import { DataTableDemo } from './data-table'
const AdminDashboard = async () => {
  return (
    <div className=' w-full  flex justify-start items-start flex-col'>
      <div className=' w-full  flex justify-start items-start flex-row gap-4'>
        <Card className=' w-full'>
          <CardHeader>
            <CardTitle>
              المنتجات 
            </CardTitle>
            <CardDescription>
              المنتجات الموجودة في متجرك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=' text-4xl font-extrabold'>0</h1>
          </CardContent>
          <CardFooter>
            <Button className=' w-full'>
              <Plus />
            </Button>
          </CardFooter>
        </Card>

        <Card className=' w-full'>
          <CardHeader>
            <CardTitle>
              الارباح 
            </CardTitle>
            <CardDescription>
             الارباح لآخر 30 يوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=' text-4xl font-extrabold'>0$</h1>
          </CardContent>
          <CardFooter>
            <Button className=' w-full'>
              <ChartArea />
            </Button>
          </CardFooter>
        </Card>


        <Card className=' w-full'>
          <CardHeader>
            <CardTitle>
              الزيارات 
            </CardTitle>
            <CardDescription>
             الزيارات لآخر 30 يوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=' text-4xl font-extrabold'>0</h1>
          </CardContent>
          <CardFooter>
            <Button className=' w-full'>
              <ChartArea />
            </Button>
          </CardFooter>
        </Card>

      </div>
      <ChartMainApp />
      <DataTableDemo />
    </div>
  )
}

export default AdminDashboard