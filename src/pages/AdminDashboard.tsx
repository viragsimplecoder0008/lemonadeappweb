
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/context/AdminContext";
import { AdminVerification } from "@/components/admin/AdminVerification";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Award, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { orders } from "@/data/orders";
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const { isAdmin, setAdminMode } = useAdmin();
  const [showAdminVerification, setShowAdminVerification] = useState(false);
  const navigate = useNavigate();
  const [vipUsers, setVipUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      setShowAdminVerification(true);
    }
    
    // Load VIP users from localStorage
    const storedVipUsers = localStorage.getItem('vipUsers');
    if (storedVipUsers) {
      setVipUsers(JSON.parse(storedVipUsers));
    }
  }, [isAdmin]);

  const handleVerificationClose = () => {
    if (!isAdmin) {
      navigate("/");
    } else {
      setShowAdminVerification(false);
    }
  };

  const handleLogout = () => {
    setAdminMode(false);
    navigate("/");
  };

  const handleRemoveVip = (userName: string) => {
    const updatedVipUsers = vipUsers.filter(user => user !== userName);
    setVipUsers(updatedVipUsers);
    localStorage.setItem('vipUsers', JSON.stringify(updatedVipUsers));
    toast.success(`${userName} removed from VIP program`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your lemonade business</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#9b87f5] text-white px-3 py-1">
              <Shield className="mr-1 h-4 w-4" /> Admin Mode
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Exit Admin Mode
            </Button>
          </div>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="mb-4 grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="messages">
              <MessageCircle className="mr-2 h-4 w-4" /> Messages
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Users className="mr-2 h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="vip">
              <Award className="mr-2 h-4 w-4" /> VIP Management
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Shield className="mr-2 h-4 w-4" /> Admin Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Employee Messages</CardTitle>
                <CardDescription>View and manage messages sent by employees</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminMessages />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>View and manage all customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>{order.shippingAddress.fullName}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                order.status === "delivered" ? "bg-green-500" : 
                                order.status === "shipped" ? "bg-blue-500" : 
                                order.status === "processing" ? "bg-yellow-500" : 
                                "bg-gray-500"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/orders")}>View All Orders</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="vip">
            <Card>
              <CardHeader>
                <CardTitle>VIP Management</CardTitle>
                <CardDescription>Manage VIP members and their perks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Perks Selected</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vipUsers.length > 0 ? (
                      vipUsers.map((userName, index) => {
                        const userPerks = localStorage.getItem(`vipPerks_${userName}`);
                        const perksArray = userPerks ? JSON.parse(userPerks) : [];
                        const perksSelected = perksArray.length > 0 ? perksArray.length : "All";
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{userName}</TableCell>
                            <TableCell>{perksSelected}</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRemoveVip(userName)}
                              >
                                Remove VIP
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No VIP members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/vip")}>Go to VIP Page</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage your admin preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4">
                  Admin settings will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AdminVerification 
        isOpen={showAdminVerification} 
        onClose={handleVerificationClose} 
      />
    </Layout>
  );
};

export default AdminDashboard;
