import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Banknote,
  Bot,
  ChartArea,
  ChartBarStacked,
  Download,
  Home,
  Settings,
  ShoppingBag,
  Store,
  UserRoundPlus,
  UsersIcon,
} from "lucide-react";

export async function AppSidebar() {
  const items = [
    {
      title: "الرئيسية",
      url: "/admin",
      icon: Home,
    },
    {
      title: "المنتجات",
      url: "/admin/products",
      icon: ShoppingBag,
    },
    {
      title: "العملاء",
      url: "/admin/clients",
      icon: UsersIcon,
    },
    {
      title: "ادوات الذكاء الاصطناعي",
      url: "/admin/ai",
      icon: Bot,
    },
    {
      title: "التصنيفات",
      url: "/admin/category",
      icon: ChartBarStacked,
    },
  ];

  const items2 = [
    {
      title: "الارباح",
      url: "/admin/money",
      icon: Banknote,
    },
    {
      title: "الزيارات",
      url: "/admin/visters",
      icon: UserRoundPlus,
    },
    {
      title: "تحليل البيانات",
      url: "/admin/anayle",
      icon: ChartArea,
    },
  ];

  const items3 = [
    {
      title: "متجري",
      url: "/admin/my-website",
      icon: Store,
    },
    {
      title: "اعدادت",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "تحديث المتجر",
      url: "/admin/update",
      icon: Download,
    },
  ];
  return (
    <Sidebar variant={"floating"} side="right" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>الاساسي</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroupLabel>التقدم</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items2.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarGroupLabel>الاعدادات</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items3.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
