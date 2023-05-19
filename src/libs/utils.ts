export function base64ToArrayBuffer(base64: string) {
  const binaryStr = window.atob(base64) // decode base64 string
  const len = binaryStr.length
  const bytes = new Uint8Array(len) // create a new Uint8Array
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i) // insert binary values into Uint8Array
  }
  return bytes.buffer // return the ArrayBuffer
}
