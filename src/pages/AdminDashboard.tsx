
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserOrders } from "@/data/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const { isAdmin, setAdminMode } = useAdmin();
  const navigate = useNavigate();
  const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false);
  const [festival, setFestival] = useState("regular");
  const [festivalName, setFestivalName] = useState("");
  const [festivalDiscount, setFestivalDiscount] = useState("10");
  const [activeFestivals, setActiveFestivals] = useState<{name: string, discount: string}[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Order statistics
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const uniqueCustomers = new Set(orders.map(order => order.shippingAddress.fullName)).size;
  
  useEffect(() => {
    // Load orders
    const fetchOrders = async () => {
      const fetchedOrders = await getUserOrders();
      setOrders(fetchedOrders);
    };
    fetchOrders();
    
    // Load any saved festivals from localStorage
    const savedFestivals = localStorage.getItem('festivals');
    if (savedFestivals) {
      setActiveFestivals(JSON.parse(savedFestivals));
    }
  }, []);

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-6">You need to enable admin mode to access this page.</p>
          <Button 
            onClick={() => navigate("/")}
            className="inline-block px-6 py-3 bg-lemonade-yellow hover:bg-lemonade-green text-black rounded-md font-medium transition-colors"
          >
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddFestival = () => {
    if (!festivalName) {
      toast.error("Please enter a festival name");
      return;
    }

    const newFestival = {
      name: festivalName,
      discount: festivalDiscount
    };

    const updatedFestivals = [...activeFestivals, newFestival];
    setActiveFestivals(updatedFestivals);
    localStorage.setItem('festivals', JSON.stringify(updatedFestivals));
    
    setFestivalName("");
    toast.success(`${festivalName} festival added with ${festivalDiscount}% discount!`);
  };

  const handleRemoveFestival = (index: number) => {
    const updatedFestivals = [...activeFestivals];
    updatedFestivals.splice(index, 1);
    setActiveFestivals(updatedFestivals);
    localStorage.setItem('festivals', JSON.stringify(updatedFestivals));
    toast.success("Festival removed successfully");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsMessagesDialogOpen(true)}
              className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              View Employee Messages
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAdminMode(false)}
            >
              Exit Admin Mode
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="vip">VIP Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{revenue.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Unique Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{uniqueCustomers}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="festivals">
            <Card>
              <CardHeader>
                <CardTitle>Manage Festivals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="festivalName">Festival Name</Label>
                      <Input 
                        id="festivalName"
                        value={festivalName}
                        onChange={(e) => setFestivalName(e.target.value)}
                        placeholder="e.g., Christmas, Diwali"
                      />
                    </div>
                    <div>
                      <Label htmlFor="festivalDiscount">Discount Percentage</Label>
                      <Select 
                        value={festivalDiscount} 
                        onValueChange={setFestivalDiscount}
                      >
                        <SelectTrigger id="festivalDiscount">
                          <SelectValue placeholder="Select discount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="25">25%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddFestival} className="w-full">Add Festival</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Active Festivals</h3>
                  {activeFestivals.length === 0 ? (
                    <p className="text-gray-500">No active festivals. Add a festival above.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeFestivals.map((festival, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{festival.name}</p>
                            <p className="text-sm text-gray-500">{festival.discount}% discount</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRemoveFestival(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-500">
                  Manage your products from the Products page. As an admin, you can edit, delete, and add products without password verification.
                </p>
                <Button onClick={() => navigate("/products")}>Go to Products</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vip">
            <Card>
              <CardHeader>
                <CardTitle>VIP Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-500">
                  Manage VIP customers and their perks. Set special offers and review VIP applications.
                </p>
                <Button onClick={() => navigate("/vip")}>Go to VIP Management</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <AdminMessages
          isOpen={isMessagesDialogOpen}
          onClose={() => setIsMessagesDialogOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
