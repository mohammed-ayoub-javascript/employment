import { z } from "zod";
import { procedure, router } from "@/trpc/trpc";
import { orders, usersTable } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";

export const orderRouter = router({
  addNewOrder: procedure
    .input(
      z.object({
        products: z.array(
          z.object({
            productId: z.number().positive("معرف المنتج غير صالح"),
            quantity: z.number().positive("الكمية يجب أن تكون رقمًا موجبًا"),
            price: z.string().min(1, "السعر مطلوب")
          })
        ),
        total: z.string().min(1, "المبلغ الإجمالي مطلوب"),
        firstName: z.string().min(2, "الاسم الأول يجب أن يكون على الأقل حرفين"),
        lastName: z.string().min(2, "الاسم الأخير يجب أن يكون على الأقل حرفين"),
        phoneNumber: z.string().min(8, "رقم الهاتف غير صالح"),
        wilaya: z.string().min(2, "الولاية مطلوبة"),
        commune: z.string().min(2, "البلدية مطلوبة"),
        status: z.enum(["pending", "processing", "completed", "cancelled"]).optional()
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newOrder = {
          products: input.products,
          total: input.total,
          status: input.status || "pending",
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          wilaya: input.wilaya,
          commune: input.commune
        };

     await db.insert(orders).values(newOrder);

        return {
          success: true,
          message: "تم إنشاء الطلب بنجاح",
        };
      } catch (error) {
        console.error("خطأ أثناء إنشاء الطلب:", error);
        throw new Error("فشل في إنشاء الطلب. يرجى المحاولة لاحقًا.");
      }
    }),
});