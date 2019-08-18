const multiply = require('./multiplyMatricies');

const K = [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
const KI = [[8, 5, 10], [21, 8, 21], [21, 12, 8]];

const boxMessage = (text) => {
  const spaces = [];
  let plain = text;
  plain.split('').forEach((char, ix) => (char === ' ' ? spaces.push(ix) : undefined));
  const { length } = plain;
  while (plain.length % 3 !== 0) plain += ' ';
  return { plain, spaces, length };
};

const unboxMessage = (cypher, box) => {
  let cypherText = cypher;
  cypherText = cypherText.substring(0, box.length);
  box.spaces.forEach((ix) => {
    cypherText = `${cypherText.substring(0, ix)} ${cypherText.substring(ix + 1)}`;
  });
  return cypherText;
};

const hill = (key) => (plainText, box) => {
  const boxed = boxMessage(plainText);
  const asciiPlain = boxed.plain.split('').map((char) => String.fromCharCode(char.charCodeAt(0) - 97));
  const numberedBlocks = asciiPlain.reduce((blocks, char, index) => {
    if (index % 3 === 0) blocks.push([char.charCodeAt(0)]);
    else blocks[blocks.length - 1].push(char.charCodeAt(0));
    return blocks;
  }, []);
  while (numberedBlocks[numberedBlocks.length - 1].length < 3) {
    numberedBlocks[numberedBlocks.length - 1].push(0);
  }

  const cypher = numberedBlocks
    .map((block) => multiply(key, block.reduce((g, c) => [...g, [c]], [])))
    .map((blockCypher) => blockCypher.map((num) => num % (26)))
    .map((row) => row.map((col) => String.fromCharCode(col + 97)).join('')).join('');

  const encrypted = { cypher };
  if (box) encrypted.plain = unboxMessage(cypher, box);
  else encrypted.box = boxed;
  return encrypted;
};

exports.encryptHill = hill(K);
exports.decryptHill = hill(KI);
