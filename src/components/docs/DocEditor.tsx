
import React, { useState, useEffect } from "react";
import { getDocById, updateDoc } from "@/data/docs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface DocEditorProps {
  docId: string;
}

const DocEditor: React.FC<DocEditorProps> = ({ docId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  useEffect(() => {
    const doc = getDocById(docId);
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content);
    }
  }, [docId]);
  
  const handleSave = () => {
    updateDoc(docId, { title, content });
  };
  
  useEffect(() => {
    // Add event listener for autosave
    const saveInterval = setInterval(handleSave, 5000); // Autosave every 5 seconds
    
    return () => {
      clearInterval(saveInterval);
      handleSave(); // Save on component unmount
    };
  }, [title, content]);
  
  return (
    <div className="space-y-4">
      <Input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold"
      />
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[500px] font-mono"
      />
      <div className="text-sm text-gray-500">
        Changes are saved automatically
      </div>
    </div>
  );
};

export default DocEditor;
