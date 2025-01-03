// import { AppSidebar } from "./Ownercomponents/Sidebar.tsx";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import CreateRoom from "./Ownercomponents/CreateRoom.tsx";
// import { Slash } from "lucide-react";

// export default function Page() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b">
//           <div className="flex items-center gap-2 px-3">
//             <SidebarTrigger />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink
//                     href="/CreateRoom"
//                     className="hover:text-primary font-medium"
//                   >
//                     Create Room
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator>
//                 <Slash/>
//                 </BreadcrumbSeparator>
//                 <BreadcrumbItem>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex m-20 justify-center items-center">
//           <CreateRoom />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
