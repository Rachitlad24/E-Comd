import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col h-full">
      <div onClick={() => handleGetProductDetails(product?._id)} className="flex-grow">
        <div className="relative">
          <div className="overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg hover:scale-105 transition-all duration-200"
          />
          </div>
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">Out Of Stock</Badge>
          ) : product?.totalStock <= 5 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {`Few items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
          ) : null}
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between gap-6">
            <h2 className="text-xl font-bold mb-2 text-balance -tracking-wider line-clamp-2">
              {product?.title}
            </h2>
            <span className="text-[16px] mt-1 text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">${product?.salePrice}</span>
            )}
          </div>

          <div className="flex-grow"></div>
        </CardContent>
      </div>

      <CardFooter className="mt-auto">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
        ) : (
          <Button onClick={() => handleAddtoCart(product?._id, product?.totalStock)} className="w-full">
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
