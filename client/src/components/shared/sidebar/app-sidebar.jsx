import * as React from "react"
import {
  LifeBuoy,
  Send,
  Search,
  Home
} from "lucide-react"

import { NavCars } from "./nav-cars"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"

import { useGenericQuery } from "@/hooks/useGenericQuery"
import { userService } from "@/api/users.service"

  
const data = {
  navMain: [
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: Search,
    // },
    {
      title: "Home",
      url: "/i",
      icon: Home,
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Підтримка",
  //     url: "#",
  //     icon: LifeBuoy,
  //   },
  //   {
  //     title: "Відправити відгук",
  //     url: "#",
  //     icon: Send,
  //   },
  // ],
}

export function AppSidebar({ ...props }) {

  const { data: user, isLoading, isError } = useGenericQuery({
    queryKey: ["user"],
    queryFn: () => userService.getUser()
  })
  if (isLoading || isError) {
    return null
  }
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavUser user={user} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCars />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
      </SidebarFooter> */}
    </Sidebar>
  )
}
