
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: "online" | "cash";
  onMethodChange: (method: "online" | "cash") => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={(value) => onMethodChange(value as "online" | "cash")}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="online" id="online" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="online" className="font-medium cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4" />
                  Online Payment
                </div>
              </Label>
              <p className="text-sm text-gray-600">
                Pay securely with your credit or debit card online
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="cash" id="cash" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cash" className="font-medium cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-4 w-4" />
                  Cash Payment
                </div>
              </Label>
              <p className="text-sm text-gray-600">
                Pay at pickup - cash before product delivery
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
