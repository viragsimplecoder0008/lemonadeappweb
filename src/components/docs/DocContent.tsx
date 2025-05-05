
import React from "react";
import { getDocById } from "@/data/docs";

interface DocContentProps {
  docId: string;
}

const DocContent: React.FC<DocContentProps> = ({ docId }) => {
  const doc = getDocById(docId);
  
  if (!doc) {
    return <div>Document not found</div>;
  }
  
  return (
    <div className="prose max-w-none">
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </div>
  );
};

export default DocContent;
