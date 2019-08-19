const mod = require('mod-op');
const multiply = require('./multiplyMatricies');


/**
 * Create 3 × 3 array from string key
 */
const generateKey = (text) => {
  const [
    a, b, c,
    d, e, f,
    g, h, i,
  ] = text.split('').map((char) => mod(char.charCodeAt(0) - 97), 26);
  if (!i) throw Error('Key too short');
  return [
    [a, b, c],
    [d, e, f],
    [g, h, i],
  ];
};

// Encryption key
const K = generateKey('gybnqkurq');
// Decryption key
const KI = generateKey('ifkvivvmi');


/**
 * Wrap the message with something called box,
 * the box remembers the actual length of the message & the index of each space in the message
 * This could be avoided by using filler text for the length of the message
 * And adding a space character to the key-space
 * But for the lack of time I preferred to use this boxing/unboxing method
 */
const boxMessage = (text) => {
  const spaces = [];
  let plain = text;
  plain.split('').forEach((char, ix) => (char === ' ' ? spaces.push(ix) : undefined));
  const { length } = plain;
  while (plain.length % 3 !== 0) plain += ' ';
  return { plain, spaces, length };
};


/**
 * Taking a decrypted text and its box, this function trims the extra characters added to the string
 * by the algorithm, and restores the spaces to the string
 */
const unboxMessage = (cypher, box) => {
  let cypherText = cypher;
  cypherText = cypherText.substring(0, box.length);
  box.spaces.forEach((ix) => {
    cypherText = `${cypherText.substring(0, ix)} ${cypherText.substring(ix + 1)}`;
  });
  return cypherText;
};


/**
 * Encrypt/Decrypt (depending on key)
 * The function takes a plainText (to be decrypted/encrypted)
 * and a box (when decryption to restore spaces)
 */
const hill = (key) => (plainText, box) => {
  const boxed = boxMessage(plainText);
  // Convert all characters to small-case alphabet, to keep the modulo function running only on 26
  const asciiPlain = boxed.plain.split('').map((char) => String.fromCharCode(char.charCodeAt(0) - 97));
  // Group the characters in array of 3 arrays each containing a number
  const numberedBlocks = asciiPlain.reduce((blocks, char, index) => {
    if (index % 3 === 0) blocks.push([char.charCodeAt(0)]);
    else blocks[blocks.length - 1].push(char.charCodeAt(0));
    return blocks;
  }, []);
  // Fill any missing spots with 0 for perfect matrix multiplication
  while (numberedBlocks[numberedBlocks.length - 1].length < 3) {
    numberedBlocks[numberedBlocks.length - 1].push(0);
  }

  const cypher = numberedBlocks
    // Multiply each group of characters with the key matrix
    .map((block) => multiply(key, block.reduce((g, c) => [...g, [c]], [])))
    // Pass the matrix to the modulo function
    .map((blockCypher) => blockCypher.map((num) => mod(num, 26)))
    // Revert the matrix to a string
    .map((row) => row.map((col) => String.fromCharCode(col + 97)).join('')).join('');

  const encrypted = { cypher };
  if (box) encrypted.plain = unboxMessage(cypher, box);
  else encrypted.box = boxed;
  return encrypted;
};

exports.encryptHill = hill(K);
exports.decryptHill = hill(KI);
