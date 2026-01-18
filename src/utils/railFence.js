/**
 * Encrypts a message using Rail Fence Cipher
 * @param {string} text - The text to encrypt
 * @param {number} rails - Number of rails (rows)
 * @returns {string} - Encrypted text
 */
export const encryptRailFence = (text, rails) => {
  if (!text || rails < 2) return text;
  
  const fence = Array(rails).fill().map(() => []);
  let rail = 0;
  let direction = 1;

  for (const char of text) {
    fence[rail].push(char);
    rail += direction;

    if (rail === rails - 1 || rail === 0) {
      direction = -direction;
    }
  }

  return fence.flat().join('');
};

/**
 * Decrypts a message using Rail Fence Cipher
 * @param {string} text - The text to decrypt
 * @param {number} rails - Number of rails
 * @returns {string} - Decrypted text
 */
export const decryptRailFence = (text, rails) => {
  if (!text || rails < 2) return text;

  const fence = Array(rails).fill().map(() => Array(text.length).fill(null));
  let rail = 0;
  let direction = 1;

  // Mark positions with placeholder
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = '?';
    rail += direction;
    if (rail === rails - 1 || rail === 0) {
      direction = -direction;
    }
  }

  // Fill in the characters
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < text.length; c++) {
      if (fence[r][c] === '?' && index < text.length) {
        fence[r][c] = text[index++];
      }
    }
  }

  // Read the zig-zag
  let result = '';
  rail = 0;
  direction = 1;

  for (let i = 0; i < text.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === rails - 1 || rail === 0) {
      direction = -direction;
    }
  }

  return result;
};

/**
 * Generates the Zig-Zag visualization data
 * @param {string} text 
 * @param {number} rails 
 */
export const generateRailFenceMatrix = (text, rails) => {
  if (!text || rails < 2) return [];

  const matrix = Array(rails).fill().map(() => Array(text.length).fill(null));
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < text.length; i++) {
    matrix[rail][i] = text[i];
    rail += direction;
    
    if (rail === rails - 1 || rail === 0) {
      direction = -direction;
    }
  }

  return matrix;
};
