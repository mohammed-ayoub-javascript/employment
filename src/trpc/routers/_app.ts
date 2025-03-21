import { router } from "../trpc";
import { productRouter, addCategoryRouter, getAllProducts , orderRouter ,getAllOrders} from ".";
export const appRouter = router({
  addproduct: productRouter,
  addcategory: addCategoryRouter,
  getAllProduct: getAllProducts,
  orderRouter : orderRouter,
  getAllOrders : getAllOrders,
});
export type AppRouter = typeof appRouter;
