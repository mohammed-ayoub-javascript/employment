import { z } from "zod";
import { procedure, router } from "@/trpc/trpc";
import { products, category } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: string;
  number?: string;
  status?: "available" | "unavailable";
  images?: string;
  categoryId?: number;
}

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
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const foundCategory = await db
          .select()
          .from(category)
          .where(eq(category.name, input.category))
          .limit(1);

        if (!foundCategory[0]) {
          return { success: false, message: "يجب ان تضيف اولا تصنيف لمنتجك" };
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
        });

        return {
          success: true,
          message: "تم إضافة المنتج بنجاح",
          product: newProduct,
        };
      } catch (error) {
        console.error("خطأ أثناء إضافة المنتج:", error);
        throw new Error("فشل في إضافة المنتج. يرجى المحاولة لاحقًا.");
      }
    }),
    updateProduct: procedure
.input(
  z.object({
    id: z.number().positive("معرف المنتج غير صالح"),
    productName: z.string().min(3, "اسم المنتج قصير جدًا").optional(),
    description: z.string().min(10, "الوصف قصير جدًا").optional(),
    price: z.number().positive("يجب أن يكون السعر رقمًا موجبًا").optional(),
    stock: z.number().int().nonnegative("المخزون يجب أن يكون عددًا صحيحًا").optional(),
    status: z.enum(["available", "unavailable"]).optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
  })
)
.mutation(async ({ input }) => {
  try {
    const updateData: ProductUpdateData = {};
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, input.id))
      .limit(1);

    if (!existingProduct[0]) {
      return { success: false, message: "المنتج غير موجود" };
    }

    if (input.productName) updateData.name = input.productName;
    if (input.description) updateData.description = input.description;
    if (input.price) updateData.price = input.price.toString();
    if (input.stock) updateData.number = input.stock.toString();
    if (input.status) updateData.status = input.status;
    if (input.images) updateData.images = JSON.stringify(input.images);

    if (input.category) {
      const foundCategory = await db
        .select()
        .from(category)
        .where(eq(category.name, input.category))
        .limit(1);

      if (!foundCategory[0]) {
        return { success: false, message: "التصنيف المحدد غير موجود" };
      }
      updateData.categoryId = foundCategory[0].id;
    }

    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, input.id));

    return {
      success: true,
      message: "تم تحديث المنتج بنجاح",
      product: updatedProduct
    };
  } catch (error) {
    console.error("خطأ أثناء تحديث المنتج:", error);
    throw new Error("فشل في تحديث المنتج. يرجى المحاولة لاحقًا.");
  }
}),
deleteProduct: procedure
    .input(
      z.object({
        id: z.number().positive("معرف المنتج غير صالح")
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [existingProduct] = await db
          .select()
          .from(products)
          .where(eq(products.id, input.id))
          .limit(1);

        if (!existingProduct) {
          return { 
            success: false, 
            message: "المنتج غير موجود" 
          };
        }

        await db
          .delete(products)
          .where(eq(products.id, input.id));

        return {
          success: true,
          message: "تم حذف المنتج بنجاح"
        };
      } catch (error) {
        console.error("خطأ أثناء حذف المنتج:", error);
        throw new Error("فشل في حذف المنتج. يرجى المحاولة لاحقًا.");
      }
    }),
});
