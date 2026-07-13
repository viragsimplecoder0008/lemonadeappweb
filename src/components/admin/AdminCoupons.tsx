import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  expires_at: string | null;
  active: boolean;
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("10");
  const [expiresAt, setExpiresAt] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("id, code, discount_percent, expires_at, active")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    // Auto-expire: deactivate expired coupons on load
    const now = new Date();
    const expired = (data ?? []).filter(c => c.active && c.expires_at && new Date(c.expires_at) < now);
    if (expired.length > 0) {
      await supabase.from("coupons").update({ active: false }).in("id", expired.map(c => c.id));
    }
    setCoupons((data ?? []).map(c => ({
      ...c,
      active: c.active && !(c.expires_at && new Date(c.expires_at) < now),
    })));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000); // re-check expirations every minute
    return () => clearInterval(t);
  }, []);

  const create = async () => {
    if (!code.trim()) return toast.error("Code required");
    const { error } = await supabase.from("coupons").insert({
      code: code.trim().toUpperCase(),
      discount_percent: parseInt(discount, 10),
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      active: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Coupon created");
    setCode(""); setExpiresAt("");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Coupon removed");
    load();
  };

  return (
    <Card>
      <CardHeader><CardTitle>Coupon Codes</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label>Code</Label>
            <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SUMMER20" />
          </div>
          <div>
            <Label>Discount %</Label>
            <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
          </div>
          <div>
            <Label>Expires At</Label>
            <Input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={create} className="w-full">Create Coupon</Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Active Coupons</h3>
          {coupons.length === 0 ? (
            <p className="text-sm text-gray-500">No coupons yet.</p>
          ) : (
            <div className="space-y-2">
              {coupons.map(c => (
                <div key={c.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <p className="font-mono font-semibold">{c.code} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100">{c.discount_percent}% off</span></p>
                    <p className="text-xs text-gray-500">
                      {c.active ? "Active" : "Inactive"}
                      {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleString()}` : " · no expiry"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => remove(c.id)}>Remove</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCoupons;
