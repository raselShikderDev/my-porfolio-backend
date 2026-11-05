
import sanitizeHtml from 'sanitize-html';

// ==========================================
// 1. Allowed HTML Elements
// ==========================================

const allowedTags = [
  // Headings and paragraphs
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',

  // Text formatting
  'strong', 'b', 'em', 'i', 'u', 's',
  'del', 'sub', 'sup',

  // Lists
  'ul', 'ol', 'li',

  // Links and images
  'a', 'img',

  // Block elements
  'blockquote', 'pre', 'code',

  // Tables
  'table', 'thead', 'tbody', 'tfoot',
  'tr', 'th', 'td',

  // Image captions
  'figure', 'figcaption',
];

// ==========================================
// 2. Allowed HTML Attributes
// ==========================================

const allowedAttributes = {
  a: ['href', 'target', 'rel', 'title'],

  img: [
    'src',
    'alt',
    'title',
    'width',
    'height',
    'loading',
  ],

  // Syntax highlighting
  code: ['class'],
  pre: ['class'],

  // Lists
  ol: ['start', 'type'],
  li: ['value'],

  // Tables
  th: ['colspan', 'rowspan', 'scope'],
  td: ['colspan', 'rowspan'],
};

// ==========================================
// 3. URL Security
// ==========================================

const allowedSchemes = [
  'http',
  'https',
  'mailto',
  'tel',
];

// ==========================================
// 4. Sanitizer Configuration
// ==========================================

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags,
  allowedAttributes,
  allowedSchemes,

  allowedSchemesByTag: {
    a: ['http', 'https', 'mailto', 'tel'],
    img: ['http', 'https'],
  },

  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
};

// ==========================================
// 5. Rich Text Sanitization
// ==========================================

export const sanitizeRichText = (html: string): string => {
  if (typeof html !== 'string' || !html.trim()) {
    return '';
  }

  return sanitizeHtml(html, sanitizeOptions);
};
