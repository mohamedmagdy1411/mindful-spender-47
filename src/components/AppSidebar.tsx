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
    <Sidebar className="bg-card/80 backdrop-blur-xl border-r border-border">
      <SidebarContent>
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger className="hover:bg-muted/50 rounded-lg transition-colors duration-200" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2">{t.menu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                    className="hover:bg-muted/50 rounded-lg transition-colors duration-200 flex items-center gap-3 px-3 py-2 w-full"
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2">{t.categories}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultCategories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton className="hover:bg-muted/50 rounded-lg transition-colors duration-200 flex items-center gap-3 px-3 py-2 w-full">
                    <span className="truncate">{category}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-muted/50 rounded-lg transition-colors duration-200 flex items-center gap-3 px-3 py-2 w-full">
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.addCategory}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}