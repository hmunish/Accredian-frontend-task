import DOMPurify from 'dompurify';
import validator from 'validator';

const sanitize = (data) => {
  let sanitizedData = DOMPurify.sanitize(data);
  sanitizedData = validator.escape(sanitizedData);
  sanitizedData = sanitizedData.trim();
  return sanitizedData;
};

export default sanitize;
