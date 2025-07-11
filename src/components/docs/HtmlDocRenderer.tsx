import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HtmlDocRendererProps {
  html: string;
  css?: string;
  title?: string;
}

const HtmlDocRenderer: React.FC<HtmlDocRendererProps> = ({ html, css, title }) => (
  <div>
    {css && (
      <Helmet>
        <style>{css}</style>
        {title && <title>{title}</title>}
      </Helmet>
    )}
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
);

export default HtmlDocRenderer; 