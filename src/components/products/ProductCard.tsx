
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Edit, Trash2, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { products as allProducts } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"edit" | "delete" | "add">("edit");
  const [editProduct, setEditProduct] = useState<Product>({ ...product });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "classic"
  });

  // Fallback image function with a more attractive placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`;
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to your cart`);
  };

  const handleAdminAction = (actionType: "edit" | "delete" | "add") => {
    setAction(actionType);
    setIsPasswordDialogOpen(true);
    if (actionType === "edit") {
      setEditProduct({ ...product });
    } else if (actionType === "add") {
      setNewProduct({
        id: "",
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "classic"
      });
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      setIsPasswordDialogOpen(false);
      setPassword("");
      setIsProductDialogOpen(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleProductSubmit = () => {
    let updatedProducts = [...allProducts];
    
    if (action === "edit") {
      // Replace the product in the array with the edited one
      const index = updatedProducts.findIndex(p => p.id === product.id);
      if (index !== -1) {
        updatedProducts[index] = editProduct;
        // Save to localStorage
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        toast.success(`${editProduct.name} has been updated`);
      }
    } else if (action === "delete") {
      // Filter out the product to delete
      updatedProducts = updatedProducts.filter(p => p.id !== product.id);
      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      toast.success(`${product.name} has been deleted`);
    } else if (action === "add") {
      // Generate an ID if not provided
      if (!newProduct.id) {
        newProduct.id = `lemonade-${new Date().getTime()}`;
      }
      // Add the new product to the array
      updatedProducts.push(newProduct as Product);
      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      toast.success(`${newProduct.name} has been added`);
    }
    
    setIsProductDialogOpen(false);
    
    // Force a reload to see the changes
    // Note: In a real app, you'd use state management instead
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link to={`/products/${product.id}`} className="block overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl || `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link to={`/products/${product.id}`} className="block">
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
              </Link>
              <div className="mt-2">
                <span className="font-bold text-lg">₹{product.price.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem 
            onClick={() => handleAdminAction("edit")}
            className="flex items-center cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => handleAdminAction("delete")}
            className="flex items-center cursor-pointer text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => handleAdminAction("add")}
            className="flex items-center cursor-pointer text-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Authentication</DialogTitle>
            <DialogDescription>
              Please enter the admin password to {action} this product.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Edit/Delete/Add Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === "edit" ? "Edit Product" : 
               action === "delete" ? "Delete Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {action === "delete" 
                ? "Are you sure you want to delete this product? This action cannot be undone."
                : "Enter the product details below."}
            </DialogDescription>
          </DialogHeader>
          
          {action !== "delete" && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={action === "edit" ? editProduct.name : newProduct.name}
                  onChange={(e) => {
                    if (action === "edit") {
                      setEditProduct({...editProduct, name: e.target.value});
                    } else {
                      setNewProduct({...newProduct, name: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="col-span-3"
                  value={action === "edit" ? editProduct.price : newProduct.price}
                  onChange={(e) => {
                    if (action === "edit") {
                      setEditProduct({...editProduct, price: parseFloat(e.target.value)});
                    } else {
                      setNewProduct({...newProduct, price: parseFloat(e.target.value)});
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={action === "edit" ? editProduct.category : newProduct.category}
                  onChange={(e) => {
                    if (action === "edit") {
                      setEditProduct({...editProduct, category: e.target.value});
                    } else {
                      setNewProduct({...newProduct, category: e.target.value});
                    }
                  }}
                >
                  <option value="classic">Classic</option>
                  <option value="specialty">Specialty</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  rows={3}
                  value={action === "edit" ? editProduct.description : newProduct.description || ""}
                  onChange={(e) => {
                    if (action === "edit") {
                      setEditProduct({...editProduct, description: e.target.value});
                    } else {
                      setNewProduct({...newProduct, description: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  className="col-span-3"
                  value={action === "edit" ? editProduct.imageUrl || "" : newProduct.imageUrl || ""}
                  onChange={(e) => {
                    if (action === "edit") {
                      setEditProduct({...editProduct, imageUrl: e.target.value});
                    } else {
                      setNewProduct({...newProduct, imageUrl: e.target.value});
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProductSubmit}
              variant={action === "delete" ? "destructive" : "default"}
            >
              {action === "edit" ? "Save Changes" : 
               action === "delete" ? "Delete Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
