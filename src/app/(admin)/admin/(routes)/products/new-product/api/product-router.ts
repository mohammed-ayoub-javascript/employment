import { z } from "zod";
import { procedure, router } from "@/trpc/trpc";
import { products, category } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";

export const productRouter = router({
  addProduct: procedure
    .input(
      z.object({
        productName: z.string().min(3, "اسم المنتج قصير جدًا"),
        description: z.string().min(10, "الوصف قصير جدًا"),
        price: z.number().positive("يجب أن يكون السعر رقمًا موجبًا"),
        stock: z.number().int().nonnegative("المخزون يجب أن يكون عددًا صحيحًا"),
        status: z.enum(["available", "unavailable"]),
        category: z.string(), 
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const foundCategory = await db
          .select()
          .from(category)
          .where(eq(category.name, input.category))
          .limit(1);

        if (!foundCategory[0]) {
          return { success: false, message: "يجب ان تضيف اولا تصنيف لمنتجك"};
        }

        const categoryId = foundCategory[0].id;

        const newProduct = await db.insert(products).values({
          name: input.productName,
          description: input.description,
          price: input.price.toString(),
          number: input.stock.toString(),
          categoryId: categoryId,
          images: JSON.stringify(input.images || []),
          createdAt: new Date(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true, message: "تم إضافة المنتج بنجاح", product: newProduct };
      } catch (error) {
        console.error("خطأ أثناء إضافة المنتج:", error);
        throw new Error("فشل في إضافة المنتج. يرجى المحاولة لاحقًا.");
      }
    }),
});