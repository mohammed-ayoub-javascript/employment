import ModuelHomeLayout from "@/modules/ui/home/layout/home-layout";
import React from "react";

export default async function HomeLayout({children} : {children : React.ReactNode}){
    return(
        <div className=" w-full h-full bg-gradient-to-r from-white/10 to-black">
            <ModuelHomeLayout>
              {children}
            </ModuelHomeLayout>
        </div>
    )
}