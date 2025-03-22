"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { getProductByName } from "@/local/local-db";
import React, { useEffect, useState } from "react";
import ButtonProduct from "@/modules/ui/home/components/products/client/button-product";
import ReactMarkdown from "react-markdown";

interface Product {
  id?: number;
  name: string;
  description: string;
  images: string[] | string;
  price: string;
  number: string;
  status: string;
  createdAt?: string;
}



const ProductPage = ({ params } : any) => {
  const decodedId = decodeURIComponent(params.id);
  const [product, setProduct] = useState<Product | null |any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData : any= await getProductByName(decodedId);
        if (productData) {
          let imagesArray: string[] = [];
          try {
            if(product?.images){
           const cleanedString = productData?.images.replace(/\\/g, '');
            imagesArray = JSON.parse(cleanedString);              
            }
          } catch (error) {
            console.error('Error parsing images:', error);
            imagesArray = [productData.images as string];
          }
          
          setProduct({
            ...productData,
            images: Array.isArray(imagesArray) ? imagesArray : [imagesArray]
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [decodedId]);

  if (loading) {
    return (
      <div className="mt-[90px] flex justify-center items-center h-[calc(100vh-90px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mt-[90px] flex flex-col items-center justify-center h-[calc(100vh-90px)]">
        <h1 className="text-2xl font-bold text-destructive">
          Product Not Found
        </h1>
        <p className="text-muted-foreground">
          The requested product does not exist
        </p>
      </div>
    );
  }

  return (
    <div className="mt-[90px] container py-8" dir="ltr">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={product.name}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden border"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover cursor-pointer"
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge
              variant={
                product.status === "available" ? "default" : "destructive"
              }
              className="text-sm"
            >
              {product.status}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-semibold text-primary">
              {Number(product.price).toLocaleString()}DA
            </p>
          </div>
          <ReactMarkdown
  components={{
    h1: ({ ...props }) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3" {...props} />
    ),
    p: ({ ...props }) => (
      <p className="text-gray-700 leading-relaxed mb-4" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-6 mb-4" {...props} />
    ),
    li: ({ ...props }) => (
      <li className="mb-2" {...props} />
    ),
    code: ({ ...props }) => (
      <code className="bg-gray-100 px-1 rounded-sm font-mono" {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-emerald-400 bg-gray-50 pl-4 italic text-gray-600 my-4" {...props} />
    ),
  }}
>
  {product.description}
</ReactMarkdown>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <ButtonProduct product={product} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">
                  الكمية المتوفرة :{" "}
                </span>
                <span className="font-medium">{product.number}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">
                  #{product.id?.toString().padStart(6, "0")}
                </span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-sm font-medium">
              معلومات المنتج
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ اضافته</span>
                <span>{new Date(product.createdAt!).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;