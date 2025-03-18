import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { options } from "@/lib/options"
  import { Banknote, Bot, BotIcon, Calendar, ChartArea, Download, Home, Inbox, Search, Settings, ShoppingBag, Store, UserRoundPlus, UsersIcon } from "lucide-react"
import { getServerSession } from "next-auth"

  export async function AppSidebar() {
    const user  = await getServerSession(options);
    const items = [
        {
          title: "الرئيسية",
          url: "#",
          icon: Home,
        },
        {
          title: "المنتجات",
          url: "#",
          icon: ShoppingBag,
        },
        {
          title: "العملاء",
          url: "#",
          icon: UsersIcon,
        },
        {
          title: "ادوات الذكاء الاصطناعي",
          url: "#",
          icon: Bot,
        },
      ]

      const items2 = [
        {
          title: "الارباح",
          url: "#",
          icon:Banknote,
        },
        {
          title: "الزيارات",
          url: "#",
          icon: UserRoundPlus,
        },
        {
          title: "تحليل البيانات",
          url: "#",
          icon: ChartArea,
        },
      ]

      const items3 = [
        {
          title: "متجري",
          url: "#",
          icon: Store,
        },
        {
          title: "اعدادت",
          url: "#",
          icon: Settings,
        },
        {
          title: "تحديث المتجر",
          url: "#",
          icon: Download,
        },
      ]
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
    )
  }
  