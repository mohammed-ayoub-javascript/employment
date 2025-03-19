import { z } from "zod";
import { procedure, router } from "@/trpc/trpc";
import { category } from "@/db/schema";
import db from "@/db";

export const addCategoryRouter = router({
    addCategory: procedure
      .input(
        z.object({
          name: z.string().min(3, "اسم التصنيف قصير جدًا"),
        })
      )
      .mutation(async ({ input }) => {
        try {  
          const newCategory = await db.insert(category).values({
            name : input.name as string,
          })
  
          return { success: true, message: "تم اضافة التصنيف بنجاح", category: newCategory };
        } catch (error) {
          console.error("خطأ أثناء إضافة التصنيف:", error);
          throw new Error("فشل في إضافة التصنيف. يرجى المحاولة لاحقًا.");
        }
      }),
});