import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";




function AddressCard({
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId
}){
    return(
        <Card 
        onClick={
            setCurrentSelectedAddress 
            ? ()=>setCurrentSelectedAddress(addressInfo) 
            :null
            }
              className={`cursor-pointer flex flex-col justify-between min-h-[250px] border-black ${selectedId?._id === addressInfo?._id ? 'border-blue-500 border-[4px]' :'border-black'}`}
            >
              
        <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' :''}grid p-4 gap-2 flex-grow`}>
            <Label>Address: {addressInfo?.address}</Label>
            <Label>City: {addressInfo?.city}</Label>
            <Label>Pincode: {addressInfo?.pincode}</Label>
            <Label>Phone: {addressInfo?.phone}</Label>
            <Label>Notes: {addressInfo?.notes}</Label>
        </CardContent>
        <CardFooter className="p-3 pt-4 flex justify-between w-full mt-auto">
    <Button className="bg-black text-white px-4 py-2 w-24 sm:w-auto" onClick={() => handleEditAddress(addressInfo)}>
        Edit
    </Button>
    <Button className="bg-red-500 text-white px-4 py-2 w-24 sm:w-auto" onClick={() => handleDeleteAddress(addressInfo)}>
        Delete
    </Button>
</CardFooter>

        </Card>
    );
}


export default AddressCard;