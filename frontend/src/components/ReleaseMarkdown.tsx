import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReleaseMarkdownProps {
  content: string;
  variant?: 'chat' | 'release';
  role?: 'user' | 'assistant';
}

export function ReleaseMarkdown({ content, variant = 'chat' }: ReleaseMarkdownProps) {
  let baseClasses = "";
  if (variant === 'release') {
    baseClasses = "prose max-w-none prose-slate prose-lg font-serif text-slate-800 leading-relaxed";
  } else {
    // Para o chat, NÃO usamos prose para herdar as fontes, tamanhos e margens exatas do .chat-bubble
    baseClasses = "text-inherit markdown-chat";
  }

  return (
    <div className={baseClasses}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-3xl font-black mb-4 text-inherit" {...props} />,
          h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-4 text-inherit" {...props} />,
          p: (props) => <p className="mb-2 last:mb-0 text-inherit" {...props} />,
          strong: (props) => <strong className="font-semibold text-inherit" {...props} />,
          hr: (props) => <hr className="my-8 border-current opacity-20" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
