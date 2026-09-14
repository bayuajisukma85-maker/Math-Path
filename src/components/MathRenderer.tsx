import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  math?: string;
  children?: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  children,
  block = false,
  className = ''
}) => {
  const content = math || children || '';

  if (!content) return null;

  try {
    const html = katex.renderToString(content, {
      displayMode: block,
      throwOnError: false
    });

    return (
      <span
        className={`math-rendered ${className} ${block ? 'block my-2 text-center overflow-x-auto py-1' : 'inline-block px-0.5'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    return <span className={`font-mono text-indigo-700 ${className}`}>{content}</span>;
  }
};
