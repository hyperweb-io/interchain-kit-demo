import { keccak256 } from 'js-sha3';

function leftPadZeros(value: string, length: number): string {
  return value.padStart(length, '0');
}

function encodeSingle(type: string, value: unknown): string {
  switch (true) {
    case /^(u?int)([0-9]*)$/.test(type):
      {
        let hexValue = Number(value).toString(16);
        hexValue = leftPadZeros(hexValue, 64);
        return hexValue;
      }

    case /^address$/.test(type):
      {
        let addr = String(value).replace(/^0x/i, '').toLowerCase();
        addr = leftPadZeros(addr, 64);
        return addr;
      }

    case /^bool$/.test(type):
      {
        // true -> 1, false -> 0
        const boolHex = value ? '1' : '0';
        return leftPadZeros(boolHex, 64);
      }

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

export function encodeParameters(types: string[], values: unknown[]): string {
  if (types.length !== values.length) {
    throw new Error('Types and values length mismatch');
  }

  let encoded = '';
  for (let i = 0; i < types.length; i++) {
    encoded += encodeSingle(types[i], values[i]);
  }
  return encoded;
}

export function getFunctionSelector(signature: string): string {
  const hashHex = keccak256(signature);
  return hashHex.slice(0, 8);
}