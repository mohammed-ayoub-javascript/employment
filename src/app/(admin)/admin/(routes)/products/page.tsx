"use client";
import React, { useEffect, useState } from "react";
import { DataTableDemo } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductTable } from "../../data-table";
import { getAllProducts } from "@/local/local-db";
interface Product {
  id?: number;
  name: string;
  description: string;
  images: string[];
  price: string;
  number: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    getAllProducts().then((res) => {
      console.log(res);

      setData(res);
      console.log(res);
    });
  }, []);
  return (
    <div>
      <Link href={"/admin/products/new-product"}>
        <Button>
          <Plus />
        </Button>
      </Link>
       <ProductTable data={data} />
    </div>
  );
};

export default Products;
