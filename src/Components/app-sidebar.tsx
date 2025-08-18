import {
  CarFront,
  Folder,
  MapPin,
  Wrench,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { LogoMenu } from "@/components/logoMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// This is sample data.
const data = {
  // TODO: 실제 유저의 데이터로 교체
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  live: [
    {
      name: "운행 정보",
      url: "/",
      icon: CarFront,
    },
    {
      name: "위치 조회",
      url: "/location",
      icon: MapPin,
    },
  ],
  database: [
    {
      name: "차량 관리",
      url: "/management",
      icon: Wrench,
    },
    {
      name: "운행 일지",
      url: "/log",
      icon: Folder,
    },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoMenu />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.live} title="실시간 조회" />
        <Separator orientation="vertical" className="h-12 mx-4" />
        <NavProjects projects={data.database} title="데이터 관리"/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  );
}
