import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { trpcServer } from '@/utils/trpc-server';
import { ShoppingBag } from 'lucide-react';
import { string } from 'zod';
interface products  {
  name : string;
  images : string;
  price : string;
  id : string;
  description : string;
}
const ProductsPage = async () => {
  const products = await trpcServer.getAllProduct.getAllProducts.query();
  console.log(products);
  
  return (
    <div className="w-full h-full flex justify-center items-center flex-col p-3">
      <h1 className="text-4xl text-black">المنتجات</h1>
      <ul className='grid grid-cols-2 gap-4 md:grid-cols-6'>
        {products.map((product : products) => (
          <Card key={product.id}>
          <CardHeader>
            <CardTitle>
              {product.name}
            </CardTitle>
            <CardDescription>
            <img src={JSON.parse(product.images.replace(/^"|"$/g, '').replace(/\\"/g, '"'))[0]} alt={product.name} className="w-full h-40 object-cover" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {product.description}

            <h1 className=' font-extrabold'>
              {product.price}دج
            </h1>
          </CardContent>
          <CardFooter>
            <Button className=' w-full'>
              <ShoppingBag />
            </Button>
          </CardFooter>
                    </Card>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
