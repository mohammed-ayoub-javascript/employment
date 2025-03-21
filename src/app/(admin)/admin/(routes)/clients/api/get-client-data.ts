import { procedure, router } from "@/trpc/trpc";
import { orders } from "@/db/schema";
import db from "@/db";

export const getAllOrders = router({
  getAllOrders: procedure.query(async () => {
    return await db.select().from(orders);
  }),
});