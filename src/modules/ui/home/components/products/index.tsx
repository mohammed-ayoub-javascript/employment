"use client";
import { trpc } from "@/utils/trpc";
import ClientProducts from "./client/client-products";

const ProductsPage = () => {
  const { data: products, isLoading, error } = trpc.getAllProduct.getAllProducts.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <ClientProducts initialProducts={products} />;
};

export default ProductsPage;
