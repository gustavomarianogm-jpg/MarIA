import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReleaseMarkdownProps {
  content: string;
  variant?: 'chat' | 'release';
  role?: 'user' | 'assistant';
}

export function ReleaseMarkdown({ content, variant = 'chat' }: ReleaseMarkdownProps) {
  if (variant === 'release') {
    return (
      <div className="font-serif">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <h1 className="text-2xl font-black mb-5 text-ink leading-tight font-display" {...props} />,
            h2: (props) => <h2 className="font-bold mt-8 mb-3 text-ink/90 uppercase tracking-widest text-[11px] font-mono border-b border-ink/10 pb-2" {...props} />,
            p: (props) => <p className="mb-4 text-[15px] leading-[1.8] text-ink/85 text-justify" {...props} />,
            ul: (props) => <ul className="mb-6 space-y-3 list-none pl-0" {...props} />,
            li: (props) => <li className="relative pl-5 text-[14.5px] leading-relaxed text-ink/85 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-rose before:rounded-full" {...props} />,
            strong: (props) => <strong className="font-bold text-ink" {...props} />,
            hr: (props) => <hr className="my-8 border-ink/10" {...props} />,
            blockquote: (props) => <blockquote className="border-l-[3px] border-plum pl-5 my-6 italic text-ink/70 text-[15.5px]" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Base classes for chat variant
  const baseClasses = "text-inherit markdown-chat";

  return (
    <div className={baseClasses}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-black mb-3 text-inherit" {...props} />,
          h2: (props) => <h2 className="text-lg font-bold mt-6 mb-2 text-inherit" {...props} />,
          p: (props) => <p className="mb-2 last:mb-0 text-inherit" {...props} />,
          strong: (props) => <strong className="font-semibold text-inherit" {...props} />,
          hr: (props) => <hr className="my-4 border-current opacity-20" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
