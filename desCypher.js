const {
  IP, PC1, PC2, IP_INVERSE, EXPANSION_PERMUTATION,
} = require('./constants');
const {
  leftCircularShift,
  split56Key,
  split64Key,
  binaryStringToNumber,
  applyPermutationOnKey,
  splitPlainTextToBlocks,
  stringToBinary,
  numberToBinaryString,
} = require('./helpers');

const shiftTable = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const key = '0001001100110100010101110111100110011011101111001101111111110001';

const deriveKeys = (masterKey) => {
  const [L, R] = split56Key(masterKey);
  const C = [L];
  const D = [R];
  const K = [];
  shiftTable.forEach((shiftFactor, shiftIndex) => {
    C[shiftIndex + 1] = leftCircularShift(C[shiftIndex], shiftFactor);
    D[shiftIndex + 1] = leftCircularShift(D[shiftIndex], shiftFactor);
  });
  (C || D).forEach((_, n) => {
    if (n === 0) return;
    K[n - 1] = applyPermutationOnKey(PC2, C[n] + D[n]);
  });
  return K;
};

const expand = (text) => applyPermutationOnKey(text, EXPANSION_PERMUTATION);

const encryptDES = (key) => (plainText) => {
  const binKey = key;
  const masterKey = applyPermutationOnKey(PC1, binKey);
  const K = deriveKeys(masterKey);

  const plaintextBlocks = splitPlainTextToBlocks('abcdffsdfsadgsdag').map((block) => stringToBinary(block).padStart(64, '0'));
  const M = plaintextBlocks.map((bin) => applyPermutationOnKey(IP, bin));

  const C = [];

  let prevL; let
    prevR;
  M.forEach((block) => {
    if (!prevL && !prevR) {
      const [L, R] = split64Key(block);
      prevL = L;
      prevR = R;
    } else {
      const prevRTemp = prevR;
      prevR = numberToBinaryString(
        binaryStringToNumber(prevL) ^ binaryStringToNumber(expand(prevR)),
      );
      prevL = prevRTemp;
    }
  });
  const output = prevR + prevL;
};

encryptDES(key);
