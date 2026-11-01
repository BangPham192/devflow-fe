import { getWorkspaceAvatarStyle } from '../../../utils/avatarColor';

interface WorkspaceAvatarProps {
  name: string;
  size?: number;
}

export default function WorkspaceAvatar({ name, size = 44 }: WorkspaceAvatarProps) {
  const style = getWorkspaceAvatarStyle(name);
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl text-base font-semibold"
      style={{
        width: size,
        height: size,
        background: style.background,
        color: style.color,
      }}
    >
      {style.initial}
    </span>
  );
}
