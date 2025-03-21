import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/modules/ui/dashboard/home/layout/dashboard-home";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import crypto from "crypto";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const hashedEmail = process.env.ADMIN; 

  if (!hashedEmail) {
    redirect("/");
  }

  const emailHash = crypto.createHash("sha256").update(session.user.email).digest("hex");

  if (emailHash !== hashedEmail) {
    redirect("/");
  }

  return (
    <div className="w-full">
      <SidebarProvider>
        <DashboardLayout>
          <Toaster />
          {children}
        </DashboardLayout>
      </SidebarProvider>
    </div>
  );
}

