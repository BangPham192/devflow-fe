/**
 * Deterministic square avatar for a workspace: no icon/color column exists on the
 * backend yet, so this derives a stable identity from the name alone — same input,
 * same result, every render, without asking the server for anything.
 */
const PALETTE = [
  { bg: '#0f172a', fg: '#e2e8f0' }, // slate
  { bg: '#0d6b60', fg: '#d8ebe7' }, // teal
  { bg: '#7c2d92', fg: '#f3e1fb' }, // violet
  { bg: '#b34700', fg: '#fde8d6' }, // burnt orange
  { bg: '#1d4ed8', fg: '#dbeafe' }, // blue
  { bg: '#be123c', fg: '#fde0e6' }, // rose
];

export interface WorkspaceAvatarStyle {
  initial: string;
  background: string;
  color: string;
}

export function getWorkspaceAvatarStyle(name: string): WorkspaceAvatarStyle {
  const trimmed = name.trim();
  let hash = 0;
  for (let i = 0; i < trimmed.length; i += 1) {
    hash = (hash * 31 + trimmed.charCodeAt(i)) >>> 0;
  }
  const swatch = PALETTE[hash % PALETTE.length];
  return {
    initial: trimmed.charAt(0).toUpperCase() || '?',
    background: swatch.bg,
    color: swatch.fg,
  };
}
