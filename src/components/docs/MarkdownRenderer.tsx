import React from "react";

// Custom markdown syntax:
// ^^Header="...",Content="...",Color="blue"^^  -> colored info box
// !coloredText."Woah!".red                     -> inline colored text
// TABLE: Col1 | Col2\n Row1a: Row1b\n ...      -> simple table
// Standard markdown: # H1 / ## H2 / **bold** / *italic* / - list / --- hr

interface Props { source: string }

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800" },
  gray: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" },
};

const inlineColorMap: Record<string, string> = {
  red: "text-red-600",
  green: "text-green-600",
  blue: "text-blue-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  pink: "text-pink-600",
};

const renderInline = (text: string, keyPrefix = ""): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  const regex = /!coloredText\."([^"]+)"\.(\w+)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      const cls = inlineColorMap[m[2].toLowerCase()] || "";
      nodes.push(<span key={`${keyPrefix}c${i}`} className={`font-semibold ${cls}`}>{m[1]}</span>);
    } else if (m[3]) {
      nodes.push(<strong key={`${keyPrefix}b${i}`}>{m[3]}</strong>);
    } else if (m[4]) {
      nodes.push(<em key={`${keyPrefix}i${i}`}>{m[4]}</em>);
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

const parseTable = (block: string, key: string) => {
  // Expected format:
  // TABLE: Header1 | Header2
  //  RowA1: RowA2
  //  RowB1: RowB2
  const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
  const first = lines[0].replace(/^TABLE:\s*/, "");
  const headers = first.split("|").map(s => s.trim());
  const rows = lines.slice(1).map(l => l.split(":").map(s => s.trim()));
  return (
    <table key={key} className="w-full border-collapse border border-gray-300 my-4">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((h, i) => (
            <th key={i} className="border border-gray-300 p-2 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} className="border border-gray-300 p-2">{renderInline(c, `t${i}${j}`)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const MarkdownRenderer: React.FC<Props> = ({ source }) => {
  // First, extract ^^...^^ boxes into placeholders so linebreaks inside don't get split.
  const boxes: { header: string; content: string; color: string }[] = [];
  const withBoxTokens = source.replace(/\^\^([\s\S]*?)\^\^/g, (_m, inner: string) => {
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let a: RegExpExecArray | null;
    while ((a = attrRegex.exec(inner)) !== null) attrs[a[1].toLowerCase()] = a[2];
    boxes.push({
      header: attrs.header || "",
      content: attrs.content || "",
      color: (attrs.color || "blue").toLowerCase(),
    });
    return `\n@@BOX${boxes.length - 1}@@\n`;
  });

  // Split into blocks by blank lines OR table-start.
  const blocks = withBoxTokens.split(/\n\s*\n/);
  const output: React.ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = (key: string) => {
    if (listBuf.length === 0) return;
    output.push(
      <ul key={key} className="list-disc pl-6 space-y-1 my-2">
        {listBuf.map((li, i) => <li key={i}>{renderInline(li, `li${key}${i}`)}</li>)}
      </ul>
    );
    listBuf = [];
  };

  blocks.forEach((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Box placeholder
    const boxMatch = trimmed.match(/^@@BOX(\d+)@@$/);
    if (boxMatch) {
      flushList(`fl${bi}`);
      const b = boxes[Number(boxMatch[1])];
      const c = colorMap[b.color] || colorMap.blue;
      output.push(
        <div key={`box${bi}`} className={`${c.bg} ${c.border} border rounded-lg p-4 my-4`}>
          {b.header && <h4 className={`font-semibold mb-2 ${c.text}`}>{b.header}</h4>}
          <div className={c.text}>{renderInline(b.content, `bc${bi}`)}</div>
        </div>
      );
      return;
    }

    // Table
    if (trimmed.startsWith("TABLE:")) {
      flushList(`fl${bi}`);
      output.push(parseTable(trimmed, `tbl${bi}`));
      return;
    }

    // Line-by-line handling for headings / hr / list / paragraph
    const lines = trimmed.split("\n");
    const isList = lines.every(l => l.trim().startsWith("- "));
    if (isList) {
      lines.forEach(l => listBuf.push(l.trim().slice(2)));
      flushList(`fl${bi}`);
      return;
    }
    flushList(`fl${bi}`);
    lines.forEach((line, li) => {
      const l = line.trim();
      if (l.startsWith("### ")) {
        output.push(<h3 key={`h3${bi}${li}`} className="text-xl font-semibold mt-4 mb-2">{renderInline(l.slice(4), `h3i${bi}`)}</h3>);
      } else if (l.startsWith("## ")) {
        output.push(<h2 key={`h2${bi}${li}`} className="text-2xl font-bold mt-6 mb-3">{renderInline(l.slice(3), `h2i${bi}`)}</h2>);
      } else if (l.startsWith("# ")) {
        output.push(<h1 key={`h1${bi}${li}`} className="text-3xl font-bold mt-6 mb-4">{renderInline(l.slice(2), `h1i${bi}`)}</h1>);
      } else if (l === "---") {
        output.push(<hr key={`hr${bi}${li}`} className="my-4" />);
      } else if (l) {
        output.push(<p key={`p${bi}${li}`} className="my-2 leading-relaxed">{renderInline(l, `pi${bi}${li}`)}</p>);
      }
    });
  });

  return <div className="max-w-none">{output}</div>;
};

export default MarkdownRenderer;
