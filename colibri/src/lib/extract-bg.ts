export function extractBgColor(classNames: string): string | null {
  const match = classNames.match(/bg-\[(#[0-9A-Fa-f]{6,8})\]/);
  return match ? match[1] : null;
}
