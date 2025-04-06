/*
MIT License
Copyright (c) 2020 Egor Nepomnyaschih
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/*
// This constant can also be computed with the following algorithm:
const l = 256, base64codes = new Uint8Array(l);
for (let i = 0; i < l; ++i) {
  base64codes[i] = 255; // invalid character
}
base64abc.forEach((char, index) => {
  base64codes[char.charCodeAt(0)] = index;
});
base64codes["=".charCodeAt(0)] = 0; // ignored anyway, so we just need to prevent an error
 */
const base64codes = [
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255,
  255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
  255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

/**
 * Obtain the value corresponding to a base64 char code.
 * /!\ Can throw if the char code given is invalid.
 * @param {number} charCode
 * @returns {number}
 */
function getBase64Code(charCode) {
  if (charCode >= base64codes.length) {
    throw new Error("Unable to parse base64 string.");
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new Error("Unable to parse base64 string.");
  }
  return code;
}

/**
 * Convert a base64 string into the corresponding Uint8Array containing its
 * corresponding binary data.
 * /!\ Can throw if an invalid base64 string was given.
 * @param {string} str
 * @returns {Uint8Array}
 */
export function base64ToBytes(str) {
  const paddingNeeded = str.length % 4;
  let paddedStr = str;
  if (paddingNeeded !== 0) {
    // console.warn("base64ToBytes: base64 given miss padding");
    paddedStr += paddingNeeded === 3 ? "=" : paddingNeeded === 2 ? "==" : "==="; // invalid, but we will catch it
  }
  const index = paddedStr.indexOf("=");
  if (index !== -1 && index < paddedStr.length - 2) {
    throw new Error("Unable to parse base64 string.");
  }
  const missingOctets = paddedStr.endsWith("==")
    ? 2
    : paddedStr.endsWith("=")
      ? 1
      : 0;
  const n = paddedStr.length;
  const result = new Uint8Array((n / 4) * 3);
  let buffer;
  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    buffer =
      (getBase64Code(paddedStr.charCodeAt(i)) << 18) |
      (getBase64Code(paddedStr.charCodeAt(i + 1)) << 12) |
      (getBase64Code(paddedStr.charCodeAt(i + 2)) << 6) |
      getBase64Code(paddedStr.charCodeAt(i + 3));
    result[j] = buffer >> 16;
    result[j + 1] = (buffer >> 8) & 0xff;
    result[j + 2] = buffer & 0xff;
  }
  return result.subarray(0, result.length - missingOctets);
}
