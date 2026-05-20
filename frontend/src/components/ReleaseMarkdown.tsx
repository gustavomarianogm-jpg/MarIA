import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReleaseMarkdownProps {
  content: string;
  variant?: 'chat' | 'release';
}

export function ReleaseMarkdown({ content, variant = 'chat' }: ReleaseMarkdownProps) {
  const baseClasses = variant === 'release' 
    ? "prose prose-slate prose-lg max-w-none font-serif text-slate-800 leading-relaxed" 
    : "prose prose-slate prose-sm max-w-none text-slate-700";

  return (
    <div className={baseClasses}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-black mb-4 text-slate-900" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
          hr: ({node, ...props}) => <hr className="my-8 border-slate-200" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
