"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChartMainApp } from "./chart";

import { getAllProducts } from "@/local/local-db";
import { ProductTable } from "./data-table";

const AdminDashboard = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    getAllProducts().then((res) => {
      console.log(res);

      setCount(res.length);
      setData(res);
      console.log(res);
    });
  }, []);
  return (
    <div className=" w-full  flex justify-start items-start flex-col">
      <div className=" w-full  flex justify-start items-start flex-row gap-4">
        <Card className=" w-full">
          <CardHeader>
            <CardTitle>المنتجات</CardTitle>
            <CardDescription>المنتجات الموجودة في متجرك</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=" text-4xl font-extrabold">{count}</h1>
          </CardContent>
          <CardFooter>
            <Button className=" w-full">
              <Plus />
            </Button>
          </CardFooter>
        </Card>

        <Card className=" w-full">
          <CardHeader>
            <CardTitle>الارباح</CardTitle>
            <CardDescription>الارباح لآخر 30 يوم</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=" text-4xl font-extrabold">0$</h1>
          </CardContent>
          <CardFooter>
          <p className=" text-red-500 text-sm">في الاصدار الاساسي لا يعمل حاليا</p>

          </CardFooter>
        </Card>

        <Card className=" w-full">
          <CardHeader>
            <CardTitle>الزيارات</CardTitle>
            <CardDescription>الزيارات لآخر 30 يوم</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className=" text-4xl font-extrabold">0</h1>
          </CardContent>
          <CardFooter>
            <p className=" text-red-500 text-sm">في الاصدار الاساسي لا يعمل حاليا</p>
          </CardFooter>
        </Card>

      </div>
      <ChartMainApp />
      {data.length > 0 && <ProductTable data={data} />}
    </div>
  );
};

export default AdminDashboard;
