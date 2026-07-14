import React from "react";
import { getDocById } from "@/data/docs";
import MarkdownRenderer from "./MarkdownRenderer";

interface DocContentProps {
  docId: string;
}

const DocContent: React.FC<DocContentProps> = ({ docId }) => {
  const doc = getDocById(docId);
  if (!doc) return <div>Document not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{doc.title}</h1>
      <MarkdownRenderer source={doc.content} />
    </div>
  );
};

export default DocContent;
