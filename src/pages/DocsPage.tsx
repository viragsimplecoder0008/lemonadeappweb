
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit, Save } from "lucide-react";
import DocContent from "@/components/docs/DocContent";
import DocEditor from "@/components/docs/DocEditor";
import { getAllDocs } from "@/data/docs";

const DocsPage: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  const docs = getAllDocs();
  
  const handleEditClick = () => {
    if (adminPassword === "admin") {
      setIsEditing(true);
      setShowPasswordInput(false);
    } else {
      setShowPasswordInput(true);
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      setIsEditing(true);
      setShowPasswordInput(false);
    } else {
      alert("Incorrect password");
    }
  };
  
  const handleSaveClick = () => {
    setIsEditing(false);
    // In a real app, this would save the doc content to a database
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
          <div className="lg:col-span-1 space-y-2">
            <h2 className="text-lg font-semibold mb-4">Topics</h2>
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
