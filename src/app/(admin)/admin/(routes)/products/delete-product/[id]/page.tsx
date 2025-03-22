"use client";

import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteProduct } from '@/local/local-db';

const DeleteProduct = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [code , setCode] = useState("");
  const [open , setOpen] = useState(true);
  const resolvedParams = React.use(params);
  const deleteMutation = trpc.addproduct.deleteProduct.useMutation();

  const handleDelete = async () => {
    try {
        if(code == resolvedParams.id){
      await deleteMutation.mutateAsync({ 
        id: Number(resolvedParams.id) 
      });
      deleteProduct(Number(resolvedParams.id));
      
      toast.success('تم حذف المنتج بنجاح');
      router.back() 
      setOpen(true);

        } else {
            toast.error("ادخل رمز المنتج صحيحا");
        }

    } catch (err) {
      console.log(err);
      
      toast.error('فشل في حذف المنتج');
    }
  };

  useEffect(() => {
    if(code == resolvedParams.id){
     setOpen(false);
    }
  } , [code])

  return (
    <div className="p-4">
      <p className="text-red-500 mb-4">
        هل أنت متأكد من حذف هذا المنتج؟ لا يمكن استرجاعه مرة أخرى إذا تم حذفه
      </p>
      الرمز : 
      <Card className=' mt-2 mb-2'>
        <CardHeader>
            <CardTitle>
                {resolvedParams.id}
            </CardTitle>
        </CardHeader>
      </Card>
      <Input onChange={(e) => {
        setCode(e.target.value)
      }} className=' w-full' placeholder='اكتب رمز المنتج لتأكيد الحذف'/>
      <Button 
        variant={"destructive"}
        onClick={handleDelete}
        disabled={open}
        className=' mt-2'
      >
        {deleteMutation.isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}
      </Button>
    </div>
  );
};

export default DeleteProduct;