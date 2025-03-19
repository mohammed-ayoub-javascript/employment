import Hero from "@/modules/ui/home/components/hero/hero";
import Products from "@/modules/ui/home/components/products";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center flex-col w-full mt-[250px]">
      <Hero />
      <Products />
    </div>
  );
}
