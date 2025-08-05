
import React from "react";
import Layout from "@/components/layout/Layout";
import { EmployeeOrderView } from "@/components/orders/EmployeeOrderView";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EmployeeMessage } from "@/components/admin/EmployeeMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeePage: React.FC = () => {
  const { isEmployee, setEmployeeMode } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMessageDialog, setShowMessageDialog] = React.useState(false);
  
  // Check if user is authenticated and has valid employee email
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Employee Authentication Required</h1>
          <p className="mb-6">Please sign in with your employee account to access this page.</p>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Employee Email Format:</strong><br />
              firstname.lastname@employeelemonade.com
            </p>
          </div>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              Sign In
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isValidEmployee = user.email?.endsWith('@employeelemonade.com');
  
  if (!isValidEmployee) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Employee Account</h1>
          <p className="mb-6">You must use an employee email to access this page.</p>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Employee Email Format:</strong><br />
              firstname.lastname@employeelemonade.com
            </p>
          </div>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
          >
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowMessageDialog(true)}
              className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              Message Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEmployeeMode(false)}
            >
              Exit Employee Mode
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Signed in as:</strong> {user.email}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Valid employee account format: firstname.lastname@employeelemonade.com
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg border p-6 mb-8">
          <EmployeeOrderView />
        </div>

        <EmployeeMessage
          isOpen={showMessageDialog}
          onClose={() => setShowMessageDialog(false)}
        />
      </div>
    </Layout>
  );
};

export default EmployeePage;
