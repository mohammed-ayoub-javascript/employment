"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonProduct from "./button-product";
import { addProduct, getAllProducts } from "@/local/local-db";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  images: string;
  price: string;
  id: string;
  description: string;
}

interface Props {
  initialProducts: Product[];
}

const ClientProducts: React.FC<Props> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const route = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localProducts: any = await getAllProducts();

        if (localProducts.length > 0) {
          setProducts(localProducts);
          console.log("تم تحميل المنتجات من IndexedDB");
        } else {
          setProducts(initialProducts);
          initialProducts.forEach(addProduct as any);
          console.log("تم تحميل المنتجات من backend وتخزينها محليًا");
        }
      } catch (error) {
        console.error("خطأ أثناء جلب المنتجات:", error);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col p-3">
      <h1 className="text-4xl text-black">المنتجات</h1>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {products.map((product) => {
          let images: string[] = [];

          try {
            if (typeof product.images === "string") {
              images = JSON.parse(product.images);
            } else if (Array.isArray(product.images)) {
              images = product.images;
            }
          } catch (error) {
            console.error("خطأ في تحليل الصور:", error);
          }

          const imageUrl = images.length > 0 ? images[0] : "";

          return (
            <Card key={product.id}>
              <CardHeader
                className=" cursor-pointer"
                onClick={() => {
                  route.push(`product/${product.name}`);
                }}
              >
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {product.description}
                <h1 className="font-extrabold">{product.price} دج</h1>
              </CardContent>
              <CardFooter>
                <ButtonProduct product={product} />
              </CardFooter>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};

export default ClientProducts;
