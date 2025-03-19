"use client";

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { addCategory , getAllCategories } from '@/local/local-db';
import { trpc } from '@/utils/trpc';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
interface Category {
  name: string;
}
const Category = () => {
  const [category, setCategory] = useState("");
  const [loading , setLoading] = useState(false)
  const [categores , setCategores] = useState<Category[]>([])

  const mutation = trpc.addcategory.addCategory.useMutation({
    onSuccess: () => {
      toast.success("تمت إضافة التصنيف بنجاح!");
      setCategory(""); 
      addCategory({name : category,});
    },
    onError: (error) => {

      toast.error(`حدث خطأ: ${error.message}`);
    }
  });

  const submitCategory = () => {
    setLoading(true)
    if (!category) {
      toast.error("حقل اسم التصنيف مطلوب");
      return;
    }
    console.log(category.length);
    if (category.length < 3) {
      toast.error("الاسم قصير جدا");
      setLoading(false);
      return;
    }

    console.log(category.length);
    
    mutation.mutate({ name: category }); 

    setLoading(false)

  };


  useEffect(() => {
    getAllCategories().then((res) => {
      setCategores(res);
    })
  }   , [category])
  return (
    <div className='w-full h-full flex justify-start items-start flex-col p-3'>
      <h1 className='text-4xl font-extrabold'>التصنيفات</h1>
      <div className='w-full'>
        <Input 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='w-full mt-4' 
          placeholder='التصنيف'
        />
        <Button 
          onClick={submitCategory} 
          className='w-full mt-5'
          disabled={loading}
        >
          {loading ? "جاري الإضافة..." : "إضافة"}
        </Button>
      </div>
      {categores.length == 0 && (
        <div>
          جار التحميل...
        </div>
      )}
      {categores.length >  0 &&(
      <div  className=' w-full mt-4'>
        <h1 className=' text-4xl font-extrabold'>
          عدد التصنيفات {categores.length}
        </h1>

        <div className=' w-full flex justify-start items-start flex-col'>
          {categores.map((item) => (
            <Card className=' w-full mt-4' key={item.name}>
              <CardHeader>
                <CardTitle>
                  {item.name}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>        
      )}

    </div>
  );
}

export default Category;
