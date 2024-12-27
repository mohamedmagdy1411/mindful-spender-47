import { Home, Receipt, PieChart, Wallet, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useLanguageStore, translations } from "@/stores/languageStore"

const defaultCategories = [
  "الطعام",
  "النقل",
  "الترفيه",
  "الصحة",
  "التعليم",
  "المنزل",
  "الملابس",
  "أخرى"
]

export function AppSidebar() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const t = translations[language]

  const items = [
    {
      title: t.dashboard,
      url: "/",
      icon: Home,
    },
    {
      title: t.expenses,
      url: "/expenses",
      icon: Receipt,
    },
    {
      title: t.income,
      url: "/income",
      icon: Wallet,
    },
    {
      title: t.reports,
      url: "/reports",
      icon: PieChart,
    },
  ]

  return (
    <Sidebar className="bg-[#2A2F3F]/90 backdrop-blur-lg border-r border-gray-800">
      <SidebarContent>
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger className="hover:bg-gray-800/50 rounded-lg transition-colors duration-200" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">{t.menu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                    className="hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">{t.categories}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultCategories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton className="hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                    <span>{category}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  <span>{t.addCategory}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}