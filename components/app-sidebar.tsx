import { CircleUser, Home, Users, UsersRound } from "lucide-react";

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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Students",
    url: "/pages/student",
    icon: Users,
  },
  {
    title: "Teachers",
    url: "/pages/teacher",
    icon: UsersRound,
  },
  {
    title: "Profile",
    url: "/pages/setting",
    icon: CircleUser,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        {" "}
        {/* Make SidebarContent a flex column */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl text-black">
            School Atendas
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-10 flex-grow">
            {" "}
            {/* Allow this section to grow */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-2 p-2"
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="flex-1">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
