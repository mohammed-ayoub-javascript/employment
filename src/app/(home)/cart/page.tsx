"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import wilaya from "./Wilaya_Of_Algeria.json";
import commune from "./Commune_Of_Algeria.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { addOrder, getAllOrders } from "@/local/local-db";
import { 
  Badge,
} from "@/components/ui/badge";
import {
  CalendarDays,
  ShoppingCart,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: string;
  number: string;
  quantity: number;
  images: string[];
  status: string;
}

interface Commune {
  id: string;
  post_code : string;
  name : string;
  wilaya_id : string;
  ar_name : string;
}
interface ProductMap {
  productId: number; 
  quantity: number;
  price: string;
}
interface Order {
  commune: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  products: ProductMap[];
  userId: number;
  wilaya: string;
  status: string;
}
const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wilayav, setWilaya] = useState("");
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCommune, setSelectedCommune] = useState("");
  const router = useRouter();
  const [isCreatingOrder , setisCreatingOrder] = useState(false);
  const { mutate: createOrder } = 
    trpc.orderRouter.addNewOrder.useMutation();

  const handleSubmitOrder = () => {
    setisCreatingOrder(true);
    if (!firstName || !lastName || !phoneNumber || !wilayav || !selectedCommune) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      setisCreatingOrder(false);

      return;
    }

    const orderData : any= {
      userId: 1,
      products: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: total.toString(),
      firstName,
      lastName,
      phoneNumber,
      wilaya: wilayaOptions.find(w => w.value === wilayav)?.label || '',
      commune: selectedCommune,
      status: "pending",
    };
    console.log(orderData);
    

    createOrder(orderData as any, {
      onSuccess: () => {
        toast.success("تم إنشاء الطلب بنجاح");
        localStorage.removeItem("cart");
        setisCreatingOrder(false);
        addOrder(orderData);
        router.refresh();
      },
      onError: () => {
        toast.error("فشل في إنشاء الطلب");
      setisCreatingOrder(false);

      }
    });
    setisCreatingOrder(false);

  };
  const extractWilayaId = (wilayaId: string) => {
    const match = wilayaId.match(/(\d+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    if (wilayav) {
      const filtered = commune.filter(
        (item) => extractWilayaId(item.wilaya_id) === wilayav,
      );
      setFilteredCommunes(filtered);
    } else {
      setFilteredCommunes([]);
    }
  }, [wilayav]);

  const wilayaOptions = useMemo(
    () =>
      wilaya.map((item) => ({
        value: item.id,
        label: item.ar_name,
      })),
    [],
  );


  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (itemId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
  };

  const handleQuantityChange = (itemId: number, newQuantity: string) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const stock = parseInt(item.number);
        const parsedValue = parseInt(newQuantity) || 0;
        let clampedValue = Math.min(Math.max(1, parsedValue), stock);

        if (parsedValue > stock) {
          toast.error(`الحد الأقصى للكمية المتاحة هو ${stock}`);
          clampedValue = stock;
        }

        if (parsedValue < 1) {
          toast.error("الحد الأدنى للكمية هو 1");
          clampedValue = 1;
        }

        return { ...item, quantity: clampedValue };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0,
  );

  useEffect(() => {
    getAllOrders().then((res) => {
      setOrders(res as any);
    })
  } , [])


  return (
    <div className="mt-[80px] container mx-auto p-4">
      <Card className="bg-background border border-muted shadow-xl">
        <CardHeader className="pb-4 border-b border-muted">
          <CardTitle className="text-3xl font-black text-right tracking-tight">
            🛒 سلة التسوق
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <span className="text-6xl">🛍️</span>
              <p className="text-2xl font-medium text-muted-foreground">
                سلة التسوق فارغة
              </p>
            </div>
          ) : (
            <>
              <Table className="border-separate border-spacing-y-4">
                <TableHeader className="[&_tr]:border-b [&_tr]:border-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right w-[120px] bg-muted/50 py-3 rounded-r-lg">
                      الصورة
                    </TableHead>
                    <TableHead className="text-right bg-muted/50 py-3">
                      المنتج
                    </TableHead>
                    <TableHead className="text-right bg-muted/50 py-3">
                      السعر
                    </TableHead>
                    <TableHead className="text-right bg-muted/50 py-3">
                      الكمية
                    </TableHead>
                    <TableHead className="text-right bg-muted/50 py-3 rounded-l-lg">
                      الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                    onLoad={() => {
                      handleQuantityChange(item.id , item.number)
                    }}
                      key={item.id}
                      className="transition-all hover:bg-muted/10 border-b border-muted"
                    >
                      <TableCell className="text-right py-4">
                        {item.images?.length > 0 && (
                          <div className="relative w-24 h-24 overflow-hidden rounded-lg border-2 border-muted">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="object-cover w-full h-full transition-opacity hover:opacity-80"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-right text-lg py-4">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-right text-lg font-semibold py-4">
                        {parseFloat(item.price).toLocaleString()} د.ج
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex flex-col items-end space-y-2">
                          <Input
                            min="1"
                            max={parseInt(item.number)}
                            type="number"
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="w-20 text-center border-2 border-muted focus:ring-0 focus:border-foreground"
                          />
                          <p className="text-xs text-muted-foreground">
                            المتوفر: {item.number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          variant="outline"
                          onClick={() => removeItem(item.id)}
                          className="border-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8 pt-6 border-t border-muted space-y-4">
                <div className="flex justify-end items-center space-x-4">
                  <span className="text-xl text-muted-foreground">
                    الإجمالي:
                  </span>
                  <h3 className="text-2xl font-black">
  {typeof total === 'number' && !isNaN(total) 
    ? `${total.toLocaleString()} د.ج`
    : ' '}
</h3>
                </div>

                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        className="h-12 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-full transition-transform hover:scale-[1.02]"
                        size="lg"
                      >
                        إتمام الشراء →
                      </Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl">
    <DialogHeader dir="rtl">
      <DialogTitle>اكمال عملية الشراء</DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="space-y-2">
          <p>الاسم</p>
          <Input 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="الاسم"
          />
        </div>

        <div className="space-y-2">
          <p>اللقب</p>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="اللقب"
          />
        </div>

        <div className="space-y-2">
          <p>رقم الهاتف</p>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
            placeholder="05xxxxxxxx"
          />
        </div>

        <div className="space-y-2">
          <p>الولاية</p>
          <Select onValueChange={setWilaya}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الولاية" />
            </SelectTrigger>
            <SelectContent>
              {wilayaOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {wilayav && (
          <div className="space-y-2">
            <p>البلدية</p>
            <Select onValueChange={setSelectedCommune}>
              <SelectTrigger>
                <SelectValue placeholder="اختر البلدية" />
              </SelectTrigger>
              <SelectContent>
                {filteredCommunes.map((item) => (
                  <SelectItem 
                    key={item.id} 
                    value={item.ar_name}
                  >
                    {item.ar_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-4 border-t mt-4">
          <h3 className="text-2xl font-bold text-center">
            الإجمالي: {total.toLocaleString()} د.ج
          </h3>
          
          <Button 
            onClick={handleSubmitOrder}
            disabled={isCreatingOrder}
            className="w-full mt-4 h-12 text-lg"
          >
            {isCreatingOrder ? 'جاري إنشاء الطلب...' : 'تأكيد الطلب'}
          </Button>

          <div className="mt-4 text-sm text-red-500">
            <p>سيتم ارسال الطلب لإدارة المتجر</p>
            <p>البريد الإلكتروني: support@example.com</p>
          </div>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="w-full flex justify-start items-start flex-col mt-8">
  <h1 className="text-3xl font-black mb-6">📋 طلباتي</h1>
  
  {orders?.length === 0 ? (
    <div className="w-full text-center py-12 border-2 border-dashed rounded-xl">
      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
      <p className="mt-4 text-lg text-muted-foreground">لا توجد طلبات حتى الآن</p>
    </div>
  ) : (
    <div className="w-full grid gap-4">
      {orders && (
        <>
          {orders.map((item: Order) => {
        const orderDate = new Date(item.createdAt).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <Card key={item.createdAt} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {orderDate}
                  </span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-600">
                 وضع التوصيل
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{item.firstName} {item.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{item.wilaya} - {item.commune}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{item.phoneNumber}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">المنتجات المطلوبة</h4>
                  <ul className="list-disc pr-4 space-y-1">
                    {item.products.map((product : ProductMap , index) => (
                      <li 
                        key={index} 
                        className="text-sm text-muted-foreground flex justify-between"
                      >
                        <span>{product.productId}</span>
                        <span>
                          {product.quantity} × {product.price} د.ج
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">المجموع الكلي:</span>
                <span className="font-bold text-lg">
                {item.products
  .reduce((acc: number, product: ProductMap) => 
    acc + (product.quantity * parseFloat(product.price)), 0)
  .toLocaleString()} د.ج
                </span>
              </div>
            </CardContent>

          </Card>
        );
      })}
        </>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default Cart;
