
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
      // Convert HTML content to plain text for editing
      const tempElement = document.createElement("div");
      tempElement.innerHTML = doc.content;
      setContent(tempElement.innerText || tempElement.textContent || "");
    }
  }, [docId]);
  
  const handleSave = () => {
    // Convert plain text to simple HTML paragraphs for storage
    const htmlContent = content
      .split("\n")
      .filter(paragraph => paragraph.trim() !== "")
      .map(paragraph => `<p>${paragraph}</p>`)
      .join("\n");
    
    updateDoc(docId, { title, content: htmlContent });
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
        className="min-h-[500px]"
        placeholder="Write your document content here..."
      />
      <div className="text-sm text-gray-500">
        Changes are saved automatically. Use line breaks for paragraphs.
      </div>
    </div>
  );
};

export default DocEditor;
