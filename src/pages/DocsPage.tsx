
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit, Save, Plus } from "lucide-react";
import DocContent from "@/components/docs/DocContent";
import DocEditor from "@/components/docs/DocEditor";
import { getAllDocs } from "@/data/docs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DocsPage: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newDocId, setNewDocId] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [showAddDocDialog, setShowAddDocDialog] = useState(false);
  
  const docs = getAllDocs();
  const isMobile = useIsMobile();

  const CORRECT_PASSWORD = "admin123";
  
  const handleEditClick = () => {
    if (adminPassword === CORRECT_PASSWORD) {
      setIsEditing(true);
      setShowPasswordInput(false);
    } else {
      setShowPasswordInput(true);
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === CORRECT_PASSWORD) {
      setIsEditing(true);
      setShowPasswordInput(false);
    } else {
      toast.error("Incorrect password");
    }
  };
  
  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleAddDoc = () => {
    if (newDocId.trim() && newDocTitle.trim()) {
      import("@/data/docs").then(({ createDoc }) => {
        createDoc({
          id: newDocId.trim().toLowerCase().replace(/\s+/g, '-'),
          title: newDocTitle,
          content: `<p>New document content</p>`,
          updatedAt: new Date().toISOString()
        });
        toast.success("New document created!");
        setNewDocId("");
        setNewDocTitle("");
        setShowAddDocDialog(false);
      });
    } else {
      toast.error("ID and title are required!");
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documentation</h1>
          
          {activeDocId && !isEditing && !showPasswordInput && (
            <Button onClick={handleEditClick} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          
          {isEditing && (
            <Button onClick={handleSaveClick} className="bg-lemonade-yellow text-black hover:bg-lemonade-green flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
          
          {showPasswordInput && (
            <form onSubmit={handlePasswordSubmit} className="flex gap-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                className="border rounded px-3 py-2"
              />
              <Button type="submit">Submit</Button>
            </form>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Topics</h2>
              <Dialog open={showAddDocDialog} onOpenChange={setShowAddDocDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="docId" className="text-sm font-medium">Document ID</label>
                      <Input 
                        id="docId" 
                        value={newDocId}
                        onChange={(e) => setNewDocId(e.target.value)}
                        placeholder="my-new-document"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="docTitle" className="text-sm font-medium">Document Title</label>
                      <Input 
                        id="docTitle" 
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="My New Document"
                      />
                    </div>
                    <Button onClick={handleAddDoc} className="w-full mt-2">
                      Create Document
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {docs.map(doc => (
                <Button 
                  key={doc.id}
                  variant={activeDocId === doc.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveDocId(doc.id)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {doc.title}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {activeDocId ? (
              isEditing ? (
                <DocEditor docId={activeDocId} />
              ) : (
                <DocContent docId={activeDocId} />
              )
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium">Select a document to view</h3>
                <p>Choose a topic from the sidebar to read the documentation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocsPage;
