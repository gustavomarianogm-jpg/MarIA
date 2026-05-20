import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReleaseMarkdownProps {
  content: string;
  variant?: 'chat' | 'release';
  role?: 'user' | 'assistant';
}

export function ReleaseMarkdown({ content, variant = 'chat', role = 'assistant' }: ReleaseMarkdownProps) {
  let baseClasses = "prose max-w-none ";
  if (variant === 'release') {
    baseClasses += "prose-slate prose-lg font-serif text-slate-800 leading-relaxed";
  } else {
    baseClasses += "prose-sm ";
    if (role === 'user') {
      baseClasses += "text-white prose-invert";
    } else {
      baseClasses += "prose-slate text-slate-700";
    }
  }

  return (
    <div className={baseClasses}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className={`text-3xl font-black mb-4 ${role === 'user' ? 'text-white' : 'text-slate-900'}`} {...props} />,
          h2: ({node, ...props}) => <h2 className={`text-2xl font-bold mt-8 mb-4 ${role === 'user' ? 'text-white' : 'text-slate-800'}`} {...props} />,
          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
          strong: ({node, ...props}) => <strong className={`font-semibold ${role === 'user' ? 'text-white' : 'text-slate-900'}`} {...props} />,
          hr: ({node, ...props}) => <hr className={`my-8 ${role === 'user' ? 'border-white/20' : 'border-slate-200'}`} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
