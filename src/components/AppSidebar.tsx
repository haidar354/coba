import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Lectern,
  FileText,
  Calendar,
  BookOpen,
  ClipboardList,
  Users,
  ChevronRight,
  School,
  // BookOpen,
  Library,
  Edit,
  Clock,
} from "lucide-react";
import educationIllustration from "../assets/logo-web-smk4-Photoroom.png";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Siswa", url: "/siswa", icon: GraduationCap },
  { title: "Guru", url: "/guru", icon: Lectern },
  { title: "Presensi Siswa", url: "/presensi", icon: Clock },
  { title: "Presensi Guru", url: "/presensi/presensi-guru", icon: Edit },
  { title: "Kelas", url: "/kelas", icon: Library },
  { title: "Jurusan", url: "/jurusan", icon: School },
  { title: "Klasifikasi Surat", url: "/klasifikasi-surat", icon: FileText },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Buku Tamu", url: "/buku-tamu", icon: BookOpen },

  {
    title: "Survei",
    icon: ClipboardList,
    submenu: [
      { title: "Daftar Survei", url: "/survei/daftar" },
      { title: "Daftar Pertanyaan Survei", url: "/survei/pertanyaan" },
      { title: "Hasil Survei", url: "/survei/hasil" },
    ],
  },
  { title: "Manajemen Role", url: "/manajemen-role", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className="bg-blue-sidebar border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-3 max-w-50 max-h-50">
            <img
              src={educationIllustration}
              alt=""
              className="object-contain max-w-40 max-h-40"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-sidebar-foreground/60 font-medium mb-2">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      open={openSubmenu === item.title}
                      onOpenChange={(open) =>
                        setOpenSubmenu(open ? item.title : null)
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent/50">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                openSubmenu === item.title ? "rotate-90" : ""
                              }`}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={getNavCls}
                                  >
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}