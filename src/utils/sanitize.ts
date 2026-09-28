import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'strong', 'em', 'u',
  'ul', 'ol', 'li',
  'a', 'blockquote',
  'code', 'pre',
];

const allowedAttributes = {
  'a': ['href'],
};

const allowedSchemes = ['http', 'https'];

const allowedSchemesApplied = allowedSchemes.map(scheme => `${scheme}:`);

const sanitizeOptions = {
  allowedTags,
  allowedAttributes,
  allowedSchemes: allowedSchemesApplied,
  allowProtocolRelative: false,
  enforceHtml: true,
};

export const sanitizeRichText = (html: string): string => {
  return sanitizeHtml(html, sanitizeOptions);
};