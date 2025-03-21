import { trpcServer } from "@/utils/trpc-server";
import ClientProducts from "./client/client-products";

const ProductsPage = async () => {
  const products = await trpcServer.getAllProduct.getAllProducts.query();

  return <ClientProducts initialProducts={products} />;
};

export default ProductsPage;
