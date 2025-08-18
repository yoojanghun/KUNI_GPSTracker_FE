import { Menu } from "lucide-react"
import LogoNoText from "../assets/logo_noText.svg"

import {
  DropdownMenu,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function LogoMenu() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center ml-1">
                <Menu onClick={()=>toggleSidebar()} size={24}/>
              </div>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={LogoNoText} alt="logo" className="size-8"></img>
              </div>
              <div className="flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">GPS Tracker</span>
              </div>
              
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
