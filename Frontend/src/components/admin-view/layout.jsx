import { useState } from "react";
import AdminHeader from "./header";
import AdminSidebar from "./sidebar";

import {Outlet} from "react-router-dom";



function AdminLayout(){
    const [openSidebar,setOpeSidebar] = useState(false)
    return (
        <div className="flex min-h-screen w-full">
           <AdminSidebar open={openSidebar} setOpen={setOpeSidebar} />
           <div className="flex flex-1 flex-col">
        <AdminHeader setOpen={setOpeSidebar}/> 
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
        <Outlet/>
        </main>
             
        </div>
        </div>
    )
}

export default AdminLayout