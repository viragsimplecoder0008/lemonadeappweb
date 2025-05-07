
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Award, Gift, Star, BadgeCheck, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const VipPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [isVipMember, setIsVipMember] = useState(false);
  const { toast } = useToast();
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);

  // Perks data
  const perks = [
    {
      id: "free-straw",
      title: "Free Straw",
      description: "Enjoy a complimentary straw with every purchase because every sip should be perfect!",
      icon: Gift,
      bgColor: "bg-[#F2FCE2]/90",
    },
    {
      id: "summer-free-lemonade",
      title: "Summer Free Lemonade",
      description: "Free Lemonade from July 1st to July 22nd – refresh yourself all summer long!",
      icon: Star,
      bgColor: "bg-[#FEF7CD]/90",
    },
    {
      id: "exclusive-flavors",
      title: "Exclusive Flavors",
      description: "Taste unique lemonade blends available only to VIP members!",
      icon: Award,
      bgColor: "bg-[#D6BCFA]/90",
    },
    {
      id: "free-hoodie",
      title: "Free Hoodie",
      description: "Get a free hoodie when you sign up between December 2nd and January 2nd – stay cozy in style!",
      icon: Gift,
      bgColor: "bg-[#F2FCE2]/90",
    },
    {
      id: "vip-gift-card",
      title: "VIP Gift Card",
      description: "Use it ANYWHERE for whatever you love!",
      icon: BadgeCheck,
      bgColor: "bg-[#FEF7CD]/90",
    }
  ];

  // Check if user is VIP on component mount
  useEffect(() => {
    const vipUsers = localStorage.getItem('vipUsers');
    if (vipUsers) {
      const parsedVipUsers = JSON.parse(vipUsers);
      const storedName = localStorage.getItem('vipUserName');
      
      if (storedName && parsedVipUsers.includes(storedName)) {
        setIsVipMember(true);
        setFullName(storedName);
        
        // Load saved perks preferences
        const savedPerks = localStorage.getItem(`vipPerks_${storedName}`);
        if (savedPerks) {
          setSelectedPerks(JSON.parse(savedPerks));
        } else {
          // If no preferences saved, select all perks by default
          setSelectedPerks(perks.map(perk => perk.id));
        }
      }
    }
  }, []);

  const handleSignUp = () => {
    setShowDialog(true);
  };

  const handleConfirm = () => {
    if (!fullName.trim()) {
      setNameError(true);
      return;
    }
    
    setShowDialog(false);
    setShowLocationDialog(true);
  };

  const handleLocationConfirm = () => {
    setShowLocationDialog(false);
    
    // Save VIP user data
    const vipUsers = localStorage.getItem('vipUsers');
    let updatedVipUsers = vipUsers ? JSON.parse(vipUsers) : [];
    if (!updatedVipUsers.includes(fullName)) {
      updatedVipUsers.push(fullName);
    }
    localStorage.setItem('vipUsers', JSON.stringify(updatedVipUsers));
    localStorage.setItem('vipUserName', fullName);
    
    // Select all perks by default for new VIP members
    const allPerkIds = perks.map(perk => perk.id);
    setSelectedPerks(allPerkIds);
    localStorage.setItem(`vipPerks_${fullName}`, JSON.stringify(allPerkIds));
    
    setIsVipMember(true);
    
    toast({
      title: "VIP Registration Successful!",
      description: `Thank you ${fullName}! You're now a VIP member with all perks enabled.`,
      duration: 5000,
    });
  };
  
  const handleUnenroll = () => {
    setShowUnenrollDialog(true);
  };
  
  const confirmUnenroll = () => {
    // Remove user from VIP list
    const vipUsers = localStorage.getItem('vipUsers');
    if (vipUsers) {
      let updatedVipUsers = JSON.parse(vipUsers);
      updatedVipUsers = updatedVipUsers.filter((name: string) => name !== fullName);
      localStorage.setItem('vipUsers', JSON.stringify(updatedVipUsers));
    }
    
    // Clean up perks preferences
    localStorage.removeItem(`vipPerks_${fullName}`);
    localStorage.removeItem('vipUserName');
    
    setIsVipMember(false);
    setSelectedPerks([]);
    setShowUnenrollDialog(false);
    
    toast({
      title: "VIP Membership Cancelled",
      description: "You've been unenrolled from the VIP program. We hope to see you again soon!",
      duration: 5000,
    });
  };

  const togglePerk = (perkId: string) => {
    if (!isVipMember) return;
    
    let newSelectedPerks;
    if (selectedPerks.includes(perkId)) {
      newSelectedPerks = selectedPerks.filter(id => id !== perkId);
    } else {
      newSelectedPerks = [...selectedPerks, perkId];
    }
    
    setSelectedPerks(newSelectedPerks);
    localStorage.setItem(`vipPerks_${fullName}`, JSON.stringify(newSelectedPerks));
    
    toast({
      title: selectedPerks.includes(perkId) ? "Perk Disabled" : "Perk Enabled",
      description: `You've ${selectedPerks.includes(perkId) ? "disabled" : "enabled"} the ${perks.find(p => p.id === perkId)?.title} perk`,
      duration: 3000,
    });
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-[#9b87f5] to-[#D6BCFA] min-h-[calc(100vh-64px)] py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-[#1A1F2C]/90 backdrop-blur-sm text-white rounded-2xl p-8 shadow-xl mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
              <span className="text-[#F2FCE2]">Lemonade</span>{" "}
              <span className="text-[#9b87f5]">VIP</span>
            </h1>
            <p className="text-lg md:text-xl text-center mb-8">
              Elevate your lemonade experience with exclusive benefits!
            </p>
            <div className="text-center">
              <Button 
                className="bg-[#9b87f5] hover:bg-[#8975e8] text-white font-bold text-lg px-8 py-6 rounded-xl"
                onClick={isVipMember ? handleUnenroll : handleSignUp}
              >
                {isVipMember ? "Unenroll from VIP" : "Become a VIP Today"}
              </Button>
            </div>
            {isVipMember && (
              <p className="text-center mt-4 text-lg">Welcome back, VIP member {fullName}!</p>
            )}
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Map through perks */}
            {perks.map((perk, index) => (
              <div 
                key={perk.id}
                className={`${perk.bgColor} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${isVipMember && !selectedPerks.includes(perk.id) ? 'opacity-50 grayscale' : ''}`}
                onClick={() => isVipMember && togglePerk(perk.id)}
              >
                <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <perk.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">{perk.title}</h3>
                <p className="text-center text-[#1A1F2C]/80">
                  {perk.description}
                </p>
                {isVipMember && (
                  <div className="flex items-center justify-center mt-4">
                    <Checkbox
                      checked={selectedPerks.includes(perk.id)}
                      onCheckedChange={() => togglePerk(perk.id)}
                      className="h-5 w-5"
                    />
                    <span className="ml-2 text-sm font-medium">
                      {selectedPerks.includes(perk.id) ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call To Action */}
          <div className="bg-[#1A1F2C]/90 backdrop-blur-sm text-white rounded-2xl p-8 shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Join today and make every sip legendary! 🍹💛</h2>
            <p className="mb-8">Cancel any time!</p>
            <Button 
              className="bg-[#9b87f5] hover:bg-[#8975e8] text-white font-bold text-lg px-8 py-6 rounded-xl"
              onClick={isVipMember ? handleUnenroll : handleSignUp}
            >
              {isVipMember ? "Unenroll from VIP" : "Become a VIP Member"}
            </Button>
            <p className="text-sm mt-4 text-gray-400">*Terms & Conditions Apply</p>
          </div>
        </div>
      </div>

      {/* Sign-up Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join VIP Membership</DialogTitle>
            <DialogDescription>
              Please enter your full name to register for our VIP program.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (e.target.value.trim()) {
                    setNameError(false);
                  }
                }}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-red-500 text-sm">Full name is required</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm">By proceeding, you agree to our VIP membership terms and conditions.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>I Agree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your VIP Registration</DialogTitle>
            <DialogDescription>
              Please visit the following location to pay in cash and activate your VIP membership.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-[#f5f5f5] p-4 rounded-lg w-full">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-[#9b87f5] mt-1" />
                <p className="text-sm">
                  <span className="font-semibold block mb-1">Payment Location:</span>
                  Kalyani Residency, Prasanth Nagar, Malkajgiri, Secunderabad, Telangana 500047
                </p>
              </div>
            </div>
            <div className="w-full">
              <a 
                href="https://maps.google.com/?q=Kalyani+Residency,+Prasanth+Nagar,+Malkajgiri,+Secunderabad,+Telangana+500047" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#9b87f5] hover:underline text-sm flex items-center gap-1 justify-center"
              >
                <MapPin className="h-4 w-4" /> Open in Google Maps
              </a>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleLocationConfirm}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unenroll Dialog */}
      <Dialog open={showUnenrollDialog} onOpenChange={setShowUnenrollDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm VIP Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your VIP membership? You'll lose access to all the exclusive perks.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnenrollDialog(false)}>Keep My VIP</Button>
            <Button variant="destructive" onClick={confirmUnenroll}>Confirm Cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default VipPage;
