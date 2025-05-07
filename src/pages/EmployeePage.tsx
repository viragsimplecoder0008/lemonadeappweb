
import React from "react";
import Layout from "@/components/layout/Layout";
import { EmployeeOrderView } from "@/components/orders/EmployeeOrderView";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EmployeeMessage } from "@/components/admin/EmployeeMessage";

const EmployeePage: React.FC = () => {
  const { isEmployee, setEmployeeMode } = useAdmin();
  const navigate = useNavigate();
  const [showMessageDialog, setShowMessageDialog] = React.useState(false);
  
  if (!isEmployee) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Employee Access Required</h1>
          <p className="mb-6">You need to enable employee mode to access this page.</p>
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
