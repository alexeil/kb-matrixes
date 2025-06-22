// Utility functions for Unicode-safe base64 encoding/decoding
export function btoaUnicode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ));
}

export function atobUnicode(str: string): string {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
}
