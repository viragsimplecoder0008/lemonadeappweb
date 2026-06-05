import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Save, Plus, Trash } from "lucide-react";
import DocContent from "@/components/docs/DocContent";
import DocEditor from "@/components/docs/DocEditor";
import { getAllDocs } from "@/data/docs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DocsPage: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDocId, setNewDocId] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [showAddDocDialog, setShowAddDocDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const docs = getAllDocs();

  const requireAdmin = () => {
    if (!isAdmin) {
      toast.error("Admin access required. Please sign in with an admin account.");
      return false;
    }
    return true;
  };

  const handleEditClick = () => {
    if (requireAdmin()) setIsEditing(true);
  };

  const handleSaveClick = () => setIsEditing(false);

  const handleAddDoc = () => {
    if (!requireAdmin()) return;
    if (newDocId.trim() && newDocTitle.trim()) {
      import("@/data/docs").then(({ createDoc }) => {
        createDoc({
          id: newDocId.trim().toLowerCase().replace(/\s+/g, "-"),
          title: newDocTitle,
          content: `<p>New document content</p>`,
          updatedAt: new Date().toISOString(),
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

  const openAddDocDialog = () => {
    if (requireAdmin()) setShowAddDocDialog(true);
  };

  const handleDeleteDoc = () => {
    if (docToDelete && requireAdmin()) {
      import("@/data/docs").then(({ deleteDoc }) => {
        deleteDoc(docToDelete);
        if (activeDocId === docToDelete) {
          setActiveDocId(null);
          setIsEditing(false);
        }
        setDocToDelete(null);
        setShowDeleteDialog(false);
        toast.success("Document deleted successfully");
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documentation</h1>

          <div className="flex items-center gap-2">
            {activeDocId && !isEditing && isAdmin && (
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Topics</h2>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0"
                  onClick={openAddDocDialog}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {docs.map((doc) => (
                <ContextMenu key={doc.id}>
                  <ContextMenuTrigger asChild>
                    <Button
                      variant={activeDocId === doc.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveDocId(doc.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {doc.title}
                    </Button>
                  </ContextMenuTrigger>
                  {isAdmin && (
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          setActiveDocId(doc.id);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Document
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setDocToDelete(doc.id);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Document
                      </ContextMenuItem>
                    </ContextMenuContent>
                  )}
                </ContextMenu>
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

      <Dialog open={showAddDocDialog} onOpenChange={setShowAddDocDialog}>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoc} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default DocsPage;
