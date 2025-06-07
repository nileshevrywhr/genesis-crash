export const validateToken = (token: string): { isValid: boolean; error?: string } => {
  if (!token || token.trim().length === 0) {
    return { isValid: false, error: 'Token is required' };
  }

  // Remove 'Bearer ' prefix if present for validation
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

  if (cleanToken.length < 10) {
    return { isValid: false, error: 'Token appears to be too short' };
  }

  // Basic format validation - should contain alphanumeric characters and possibly special chars
  const tokenRegex = /^[A-Za-z0-9._-]+$/;
  if (!tokenRegex.test(cleanToken)) {
    return { isValid: false, error: 'Token contains invalid characters' };
  }

  return { isValid: true };
};

export const formatToken = (token: string): string => {
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  return `Bearer ${cleanToken}`;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
