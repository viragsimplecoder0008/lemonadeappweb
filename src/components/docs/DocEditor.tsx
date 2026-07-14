
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
        placeholder="Document Title"
      />
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[500px] font-mono text-sm"
        placeholder={`Markdown syntax:\n\n# Heading\n## Sub-heading\n**bold** *italic*\n- list item\n\n^^Header="Pro Tip",Content="VIP gets discounts!",Color="blue"^^\n\n!coloredText."Woah!".red\n\nTABLE: Platform | Controls\n Desktop: Arrow keys\n Mobile: Swipe`}
      />
      <div className="text-sm text-gray-500">
        Autosaves every 5s. Use markdown + custom tags:
        <code className="ml-2">^^Header="",Content="",Color=""^^</code>,
        <code className="ml-2">!coloredText."text".red</code>,
        <code className="ml-2">TABLE: A | B</code>
      </div>
    </div>
  );
};

export default DocEditor;
