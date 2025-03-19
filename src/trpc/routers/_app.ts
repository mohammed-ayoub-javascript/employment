import {  router } from '../trpc';
import { productRouter , addCategoryRouter } from '.';
export const appRouter = router({
  addproduct : productRouter,
  addcategory : addCategoryRouter,
});
export type AppRouter = typeof appRouter;