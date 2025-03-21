import { productRouter } from "@/app/(admin)/admin/(routes)/products/new-product/api/product-router";
import { addCategoryRouter } from "@/app/(admin)/admin/(routes)/category/api/add-category";
import { getAllProducts } from "@/modules/ui/home/components/products/api/get-all-products";
import { orderRouter } from "@/app/(home)/cart/api/send-order";
import { getAllOrders } from "@/app/(admin)/admin/(routes)/clients/api/get-client-data";


export { productRouter, addCategoryRouter, getAllProducts  , orderRouter , getAllOrders};
