import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const INGREDIENTS = ["Mint", "Ginger", "Strawberry", "Blueberry", "Rose", "Lavender", "Cola", "Basil", "Honey"];

const CustomOrderDialog: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sweetness, setSweetness] = useState([50]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [size, setSize] = useState("Medium");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggle = (i: string) =>
    setIngredients((prev) => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!address.trim() || !phone.trim()) {
      toast.error("Address and phone are required");
      return;
    }
    setSubmitting(true);
    const price = size === "Large" ? 180 : size === "Small" ? 100 : 140;
    const payload = {
      id: crypto.randomUUID(),
      user_id: user.id,
      total_price: price,
      status: "pending",
      payment_method: "cod",
      is_custom: true,
      custom_details: { sweetness: sweetness[0], ingredients, notes, size },
      shipping_full_name: profile?.name || profile?.username || user.email?.split("@")[0] || "Customer",
      shipping_address: address,
      shipping_city: "Hyderabad",
      shipping_state: "Telangana",
      shipping_postal_code: "500001",
      shipping_country: "India",
      shipping_phone_number: phone,
      shipping_email: profile?.email || user.email || null,
    };
    const { error } = await supabase.from("orders").insert(payload);
    setSubmitting(false);
    if (error) {
      console.error("Custom order insert failed:", error);
      toast.error(error.message || "Failed to place custom order");
      return;
    }
    toast.success("Custom order placed! ETA 24+ hours. Track it in your Orders page.");
    setOpen(false);
    setIngredients([]); setNotes(""); setAddress(""); setPhone(""); setSweetness([50]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-lemonade-yellow to-lemonade-green text-black font-bold gap-2">
          <Sparkles className="h-4 w-4" /> CUSTOM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Design Your Custom Lemonade</DialogTitle>
          <DialogDescription>
            Custom orders take 24 hours or more to prepare and deliver.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sweetness: {sweetness[0]}%</Label>
            <Slider value={sweetness} onValueChange={setSweetness} min={0} max={100} step={5} />
          </div>
          <div>
            <Label>Size</Label>
            <div className="flex gap-2 mt-1">
              {["Small", "Medium", "Large"].map(s => (
                <Button key={s} type="button" size="sm" variant={size === s ? "default" : "outline"} onClick={() => setSize(s)}>{s}</Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Ingredients</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {INGREDIENTS.map(i => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={ingredients.includes(i)} onCheckedChange={() => toggle(i)} />
                  {i}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any other requests..." maxLength={500} />
          </div>
          <div>
            <Label htmlFor="addr">Delivery Address</Label>
            <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Placing..." : "Place Custom Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomOrderDialog;
