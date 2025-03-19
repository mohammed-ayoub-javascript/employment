import {  router } from '../trpc';
import { productRouter , addCategoryRouter, getAllProducts } from '.';
export const appRouter = router({
  addproduct : productRouter,
  addcategory : addCategoryRouter,
  getAllProduct : getAllProducts,
});
export type AppRouter = typeof appRouter;