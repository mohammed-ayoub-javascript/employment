import { procedure, router } from "@/trpc/trpc";
import { products } from "@/db/schema";
import db from "@/db";

export const getAllProducts = router({
  getAllProducts: procedure.query(async () => {
    return await db.select().from(products);
  }),
});
