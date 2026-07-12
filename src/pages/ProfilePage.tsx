import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import OrdersList from "@/components/orders/OrdersList";
import { getUserOrders } from "@/data/orders";
import { Order } from "@/types";

const ProfilePage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setUsername(profile.username || "");
      setAvatarUrl((profile as any).avatar_url || "");
    }
  }, [profile]);

  useEffect(() => {
    if (user) getUserOrders().then(setOrders);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, username, avatar_url: avatarUrl || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast(error.message || "Failed to save profile");
    } else {
      toast("Profile updated");
    }
  };

  if (loading || !profile) {
    return <Layout><div className="container mx-auto px-4 py-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback>{(username || "?").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar">Avatar Image URL</Label>
                  <Input
                    id="avatar"
                    placeholder="https://..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email (read-only)</Label>
                <Input id="email" value={profile.email || ""} disabled />
              </div>
              <div>
                <Label htmlFor="username">Username (display name)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <OrdersList orders={orders} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
