'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Safely renders HTML content with XSS sanitization using DOMPurify.
 * 
 * This component:
 * 1. Sanitizes HTML to prevent XSS attacks
 * 2. Allows safe HTML tags for formatting (p, br, strong, em, ul, ol, li, a, etc.)
 * 3. Removes dangerous attributes and scripts
 * 4. Renders the sanitized content using dangerouslySetInnerHTML
 */
export function SafeHtml({ html, className = '' }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

  useEffect(() => {
    // Configure DOMPurify to allow only safe tags and attributes
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'span', 'div',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption',
        'hr', 'sup', 'sub'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'title', 'alt', 'src', 'class', 'id',
        'style', 'width', 'height'
      ],
      // Add target="_blank" and rel="noopener noreferrer" to all links
      ADD_ATTR: ['target'],
      ALLOW_DATA_ATTR: false,
      // Hook to add secure link attributes
      RETURN_TRUSTED_TYPE: false,
    });

    // Post-process to make links open in new tab securely
    const processedHtml = clean.replace(
      /<a\s+([^>]*href=[^>]*)>/gi,
      '<a $1 target="_blank" rel="noopener noreferrer">'
    );

    setSanitizedHtml(processedHtml);
  }, [html]);

  // Don't render anything if html is empty or only whitespace
  if (!html || !html.trim()) {
    return null;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

/**
 * Checks if a string contains HTML tags
 */
export function containsHtml(str: string): boolean {
  const htmlRegex = /<[^>]*>/;
  return htmlRegex.test(str);
}

/**
 * Strips all HTML tags from a string (for plain text fallback)
 */
export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  // Server-side fallback - basic regex strip
  return html.replace(/<[^>]*>/g, '');
}

