
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Edit, Trash2, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { saveProductToDatabase, deleteProductFromDatabase } from "@/data/products";

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
import { monsoonWinterProducts } from "@/data/monsoonWinterProducts";

interface ProductCardProps {
  product: Product;
  storageKey?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, storageKey = "products" }) => {
  const { cartItems, addQuantityToCart, removeQuantityFromCart } = useCart();
  const { isAdmin } = useAdmin();
  const { profile } = useAuth();
  const isGolden = product.category === "premium";
  const canBuyGolden = profile?.vip_status === "approved" || isAdmin;

  const inCartItem = cartItems.find((item) => item.product.id === product.id);

  // Bulk order dialog state
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isBulkOrder, setIsBulkOrder] = useState(false);
  const [addQuantity, setAddQuantity] = useState(1);

  // Item removal state
  const [removeAmount, setRemoveAmount] = useState(1);

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"edit" | "delete" | "add" | "stock">("edit");
  const [editProduct, setEditProduct] = useState<Product>({ ...product });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "classic",
    inStock: true
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`;
  };

  const handleOpenAddToCart = () => {
    if (isGolden && !canBuyGolden) {
      toast.error("Golden Flavors are VIP-only. Apply for VIP on /vip to unlock this drink.");
      return;
    }
    setIsBulkOrder(false);
    setAddQuantity(1);
    setIsBulkDialogOpen(true);
  };

  const handleConfirmAddToCart = () => {
    const qty = Math.max(1, addQuantity);
    if (!isBulkOrder && qty > 5) {
      toast.error(`If not planning a Bulk Order, you can only get 5 ${product.name}s.`);
      return;
    }
    addQuantityToCart(product, qty, isBulkOrder);
    setIsBulkDialogOpen(false);
  };

  const handleAdminAction = (actionType: "edit" | "delete" | "add" | "stock") => {
    setAction(actionType);
    
    // If admin mode is active, skip password verification
    if (isAdmin) {
      // For stock toggle, handle it immediately
      if (actionType === "stock") {
        handleStockToggle();
      } else {
        // For other actions, show the product dialog directly
        setEditProduct({ ...product });
        if (actionType === "add") {
          setNewProduct({
            id: "",
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            category: "classic",
            inStock: true
          });
        }
        setIsProductDialogOpen(true);
      }
    } else {
      // Not in admin mode, show password dialog
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
          category: "classic",
          inStock: true
        });
      }
    }
  };

  const handlePasswordSubmit = () => {
    // Hardcoded passwords removed. Admin actions require a server-verified admin role.
    setIsPasswordDialogOpen(false);
    setPassword("");
    toast.error("Admin access required. Please sign in with an admin account.");
  };

  const getTargetProducts = (): Product[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {
      /* ignore */
    }
    return storageKey === "monsoon_winter_products" ? monsoonWinterProducts : allProducts;
  };

  const handleStockToggle = async () => {
    let updatedProducts = [...getTargetProducts()];
    const index = updatedProducts.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      const updatedProduct = {
        ...updatedProducts[index],
        inStock: !updatedProducts[index].inStock
      };
      updatedProducts[index] = updatedProduct;
      localStorage.setItem(storageKey, JSON.stringify(updatedProducts));

      await saveProductToDatabase(updatedProduct);

      toast.success(`${product.name} is now ${updatedProduct.inStock ? 'in stock' : 'out of stock'}`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleProductSubmit = async () => {
    let updatedProducts = [...getTargetProducts()];
    
    if (action === "edit") {
      const index = updatedProducts.findIndex(p => p.id === product.id);
      if (index !== -1) {
        updatedProducts[index] = editProduct;
        localStorage.setItem(storageKey, JSON.stringify(updatedProducts));
        await saveProductToDatabase(editProduct);
        toast.success(`${editProduct.name} has been updated`);
      }
    } else if (action === "delete") {
      updatedProducts = updatedProducts.filter(p => p.id !== product.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedProducts));
      await deleteProductFromDatabase(product.id);
      toast.success(`${product.name} has been deleted`);
    } else if (action === "add") {
      if (!newProduct.id) {
        newProduct.id = newProduct.name ? newProduct.name.trim().replace(/\s+/g, "-") : `lemonade-${Date.now()}`;
      }
      const prodToAdd = newProduct as Product;
      updatedProducts.push(prodToAdd);
      localStorage.setItem(storageKey, JSON.stringify(updatedProducts));
      await saveProductToDatabase(prodToAdd);
      toast.success(`${newProduct.name} has been added`);
    }
    
    setIsProductDialogOpen(false);
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const productSlug = product.name ? product.name.trim().replace(/\s+/g, "-") : product.id;
  const productDetailPath = storageKey === "monsoon_winter_products"
    ? `/products/monsoon/${productSlug}`
    : `/products/${product.id}`;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link to={productDetailPath} className="block overflow-hidden relative">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl || `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
                />
              </div>
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Out of Stock</span>
                </div>
              )}
            </Link>
            <CardContent className="p-4">
              <Link to={productDetailPath} className="block">
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
              </Link>
              <div className="mt-2">
                <span className="font-bold text-lg">₹{product.price.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex-col gap-2">
              <Button 
                className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black font-semibold"
                onClick={handleOpenAddToCart}
                disabled={product.inStock === false}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {inCartItem && (
                <div className="w-full mt-1 p-2 bg-red-50/80 rounded-lg border border-red-200 text-xs text-left">
                  <div className="font-semibold text-red-950 mb-1 flex justify-between items-center">
                    <span>In Cart: {inCartItem.quantity} {product.name}(s)</span>
                  </div>
                  <div className="text-[11px] text-red-900 mb-1.5 font-medium">
                    Remove this(ese) Item(s) from Cart?
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={inCartItem.quantity}
                      value={removeAmount}
                      onChange={(e) => setRemoveAmount(Math.max(1, Math.min(inCartItem.quantity, parseInt(e.target.value) || 1)))}
                      className="h-7 w-16 text-xs px-1.5 bg-white border-red-300"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs px-2 flex-1"
                      onClick={() => removeQuantityFromCart(product.id, removeAmount)}
                    >
                      Remove ({removeAmount})
                    </Button>
                  </div>
                </div>
              )}
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
            onClick={() => handleAdminAction("stock")}
            className="flex items-center cursor-pointer"
          >
            {product.inStock ? (
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            )}
            Mark as {product.inStock ? 'Out of Stock' : 'In Stock'}
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

      {/* Bulk Order & Add to Cart Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {product.name} to Cart</DialogTitle>
            <DialogDescription className="text-foreground/90 font-medium mt-1">
              Are you planning a Bulk Order? Specify the number. If not, you can only get 5 {product.name}s.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="space-y-0.5">
                <Label className="font-semibold text-amber-900 cursor-pointer" htmlFor={`bulk-${product.id}`}>
                  Planning a Bulk Order?
                </Label>
                <p className="text-xs text-amber-700">Enable to order more than 5 items.</p>
              </div>
              <input
                id={`bulk-${product.id}`}
                type="checkbox"
                checked={isBulkOrder}
                onChange={(e) => {
                  setIsBulkOrder(e.target.checked);
                  if (!e.target.checked && addQuantity > 5) {
                    setAddQuantity(5);
                  }
                }}
                className="h-5 w-5 rounded border-amber-300 text-lemonade-yellow focus:ring-lemonade-yellow cursor-pointer"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">
                Quantity {isBulkOrder ? "(Bulk Order - Any Amount below 50 Items)" : "(Max 5 without Bulk Order)"}
              </Label>
              <Input
                type="number"
                min={1}
                max={isBulkOrder ? 50 : 5}
                value={addQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (!isBulkOrder && val > 5) {
                    setAddQuantity(5);
                  } else if (isBulkOrder && val > 50) {
                    setAddQuantity(50);
                    toast.error("Bulk Orders are limited to any amount below 50 items.");
                  } else {
                    setAddQuantity(Math.max(1, val));
                  }
                }}
                className="mt-1"
              />
              {!isBulkOrder && addQuantity >= 5 && (
                <p className="text-xs text-amber-600 mt-1">
                  Reached limit of 5. Check "Planning a Bulk Order?" to order up to 50 items.
                </p>
              )}
              {isBulkOrder && (
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  Bulk Order limit: up to 50 items.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAddToCart} className="bg-lemonade-yellow hover:bg-lemonade-green text-black font-semibold">
              Confirm & Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Only show password dialog if not in admin mode */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Authentication</DialogTitle>
            <DialogDescription>
              Please enter the admin password to {action === "stock" 
                ? `mark this product as ${product.inStock ? "out of stock" : "in stock"}` 
                : action} this product.
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
