/** "Xuân Bằng" -> "XB", "phamxuanbang" -> "P". Same idea as any chat app's default avatar. */
export function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return value.trim().charAt(0).toUpperCase() || '?';
}
