"use client";

import { getProduct, getAllCategories, updateProduct } from '@/local/local-db';
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { trpc } from "@/utils/trpc";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  name: string;
}

const EditProject = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const [categores, setCategores] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const mutation = trpc.addproduct.updateProduct.useMutation()

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    status: "available",
    category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await getProduct(Number(resolvedParams.id));
        if (product) {
          setFormData({
            productName: product.name,
            description: product.description,
            price: product.price,
            stock: product.number,
            status: product.status,
            category:  "" ,
          });
          setExistingImages(Array.isArray(product.images) ? product.images : []);
        }
        
        const categories = await getAllCategories();
        setCategores(categories);
      } catch (err) {
        console.log(err);
        
        toast.error("فشل في تحميل بيانات المنتج");
      }
    };
  
    fetchData();
  }, [resolvedParams.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProductImages(prev => [...prev, ...files]);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      setProductImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNumber = parseFloat(formData.price);
    const stockNumber = parseInt(formData.stock);

    if (isNaN(priceNumber)) {
      toast.error("يجب إدخال سعر صحيح");
      return;
    }

    if (isNaN(stockNumber)) {
      toast.error("يجب إدخال كمية مخزون صحيحة");
      return;
    }

    try {
      const newImageUrls = await Promise.all(
        productImages.map(async (file) => {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const formData = new FormData();
          formData.append("image", base64.split(",")[1]);

          const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=8b6fcce707d40c655338ca4af29b4d2b`,
            formData
          );

          return response.data.data.url;
        })
      );

      const allImages = [...existingImages, ...newImageUrls.filter(url => url)];

      const result = await mutation.mutateAsync({
        id: Number(resolvedParams.id),
        productName: formData.productName,
        description: formData.description,
        price: priceNumber,
        stock: stockNumber,
        status: formData.status as "available" | "unavailable",
        category: formData.category,
        images: allImages,
      });

      if (result.success) {
        await updateProduct(Number(resolvedParams.id), {
          id: Number(resolvedParams.id),
          name: formData.productName,
          description: formData.description,
          price: priceNumber.toString(),
          number: stockNumber.toString(),
          status: formData.status as "available" | "unavailable",
          images: allImages,
        });

        toast.success("تم تحديث المنتج بنجاح");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("فشل في تحديث المنتج:", error);
      toast.error("حدث خطأ أثناء تحديث المنتج");
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-5">
      <h1 className="text-4xl font-extrabold mb-4">تعديل المنتج</h1>

      <p className="mt-4 mb-1">اسم المنتج</p>
      <Input
        name="productName"
        value={formData.productName}
        onChange={handleInputChange}
        placeholder="اسم المنتج"
      />

      <p className="mt-4 mb-1">وصف المنتج</p>
      <SimpleMDE
        value={formData.description}
        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
      />
      <Card className="mt-4">
        <CardContent className="p-4 prose max-w-none">
        <ReactMarkdown
  components={{
    h1: ({node, ...props}) => <h1 onLoad={() => {
      console.log(node);
    }} className="text-3xl font-bold text-gray-900 dark:text-white mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 onLoad={() => {
      console.log(node);
    }} className="text-2xl font-semibold text-gray-800 mt-6 mb-3" {...props} />,
    p: ({node, ...props}) => <p onLoad={() => {
      console.log(node);
    }} className="text-gray-700 leading-relaxed mb-4" {...props} />,
    ul: ({node, ...props}) => <ul onLoad={() => {
      console.log(node);
    }} className="list-disc pl-6 mb-4" {...props} />,
    li: ({node, ...props}) => <li onLoad={() => {
      console.log(node);
    }} className="mb-2" {...props} />,
    code: ({node, ...props}) => <code onLoad={() => {
      console.log(node);
    }} className="bg-gray-100 px-1 rounded-sm font-mono" {...props} />,
    blockquote: ({node, ...props}) => <blockquote  onLoad={() => {
      console.log(node);
    }}className="border-l-4 border-emerald-400 bg-gray-50 pl-4 italic text-gray-600 my-4" {...props} />,
  }}
>
  {formData.description}
</ReactMarkdown>
        </CardContent>
      </Card>

      <p className="mt-4 mb-1">سعر المنتج</p>
      <Input
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        type="number"
      />

      <p className="mt-4 mb-1">الكمية المتاحة</p>
      <Input
        name="stock"
        value={formData.stock}
        onChange={handleInputChange}
        type="number"
      />

      <p className="mt-4 mb-1">القسم</p>
      <Select value={formData.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر القسم" />
        </SelectTrigger>
        <SelectContent>
          {categores.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="mt-4 mb-1">الصور الحالية</p>
      <div className="flex flex-wrap gap-2">
        {existingImages.map((src, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={src}
              alt="صورة المنتج"
              className="w-32 h-32 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => removeImage(index, false)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-4 mb-1">إضافة صور جديدة</p>
      <div className="w-full py-9 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
      <p className="mt-4 mb-1">صور المنتج</p>
      <div className="w-full py-9  rounded-2xl border border-gray-300 gap-3 grid border-dashed">
        <div className="grid gap-1">
          <svg
            className="mx-auto"
            width={40}
            height={40}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="File">
              <path
                id="icon"
                d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                fill="#4F46E5"
              />
            </g>
          </svg>
          <h2 className="text-center text-gray-400   text-xs leading-4">
            PNG, JPG , SVG..
          </h2>
        </div>
        <div className="grid gap-2">
          <h4 className="text-center text-gray-200 text-sm font-medium leading-snug">
            اسحب و افلت الملف هنا
          </h4>
          <div className="flex items-center justify-center">
            <label>
              <input type="file" hidden={true} onChange={handleImageChange} />
              <div className="flex w-28 h-9 px-2 flex-col bg-white rounded-full shadow text-black text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                او اختر ملف
              </div>
            </label>
          </div>
        </div>
      </div>      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {imagePreviews.map((src, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={src}
              alt="معاينة جديدة"
              className="w-32 h-32 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => removeImage(index, true)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>

      <Button className="mt-6 w-full" onClick={handleSubmit}>
        حفظ التعديلات
      </Button>
    </div>
  );
};

export default EditProject;