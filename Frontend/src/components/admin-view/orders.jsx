import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Ellipsis} from "lucide-react";

function AdminOrdersView(){

const [openDetailsDialog,setOpenDetailsDialog] = useState(false);
const {orderList,orderDetails} = useSelector(state=>state.adminOrder);
const dispatch = useDispatch();


function handleFetchOrderDetails(getId){
dispatch(getOrderDetailsForAdmin(getId))
}

useEffect(()=>{
 dispatch(getAllOrdersForAdmin())
},[dispatch])

console.log(orderDetails,'orderdetails');

useEffect(()=>{
if(orderDetails !==null){
  setOpenDetailsDialog(true)
}
},[orderDetails])



    return(
 <Card>
    <CardHeader>
     <CardTitle>All Orders</CardTitle>
     </CardHeader>
     <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                <TableHead> Order ID</TableHead>
                <TableHead> Order Date</TableHead>
                <TableHead> Order Status</TableHead>
                <TableHead> Order Price</TableHead>
                <TableHead>
                 <span className="sr-only">Details</span>
                </TableHead>
                 </TableRow>
             </TableHeader>
             <TableBody>
             {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-blue-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : orderItem?.orderStatus === "delivered" 
                            ? "bg-green-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                       
                       <Ellipsis className="text-black hover:text-blue-500 focus:text-blue-500 transition-all duration-300"  onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          } />
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
             </TableBody>
           </Table>
           </CardContent> 
   </Card>
    );
}


export default AdminOrdersView;