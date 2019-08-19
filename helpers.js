const keyToBinary = (key) => key.split('').reduceRight((bin, char, ix) => bin + (char.charCodeAt(0) * (10 ** ix)), 0).toString(2).substring(0, 64);

const leftCircularShift = (binaryString, shiftFactor) => `${binaryString.substring(shiftFactor)}${binaryString.substring(0, shiftFactor)}`;

const split64Key = (binaryStringKey) => [binaryStringKey.substring(0, 32), binaryStringKey.substring(32)];

const split56Key = (binaryStringKey) => [binaryStringKey.substring(0, 28), binaryStringKey.substring(28)];

const binaryStringToNumber = (bin) => parseInt(bin, 2);

const applyPermutationOnKey = (permutation, key) => permutation.reduce((result, permutationIndex) => result + key[permutationIndex - 1], '');

const splitPlainTextToBlocks = (plainText) => plainText.split('')
  .reduce((blocks, char) => {
    const lastBlockIndex = blocks.length - 1;
    if (Buffer.byteLength(blocks[lastBlockIndex] + char) <= 8) blocks[lastBlockIndex] += char;
    else blocks.push(char);
    return blocks;
  }, ['']);

const stringToNumber = (string) => string.split('').reduceRight((sum, char, ix) => sum + (char.charCodeAt(0) * (10 ** ix)), 0);

const numberToBinaryString = (number) => number.toString(2);

const stringToBinary = (string) => string.split('').reduce((bin, char) => bin + char.charCodeAt(0).toString(2).padStart(8, '0'), '');

module.exports = {
  keyToBinary,
  leftCircularShift,
  split64Key,
  split56Key,
  binaryStringToNumber,
  applyPermutationOnKey,
  splitPlainTextToBlocks,
  stringToNumber,
  numberToBinaryString,
  stringToBinary,
};
