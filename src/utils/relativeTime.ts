import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(iso: string | null): string | null {
  return iso ? dayjs(iso).fromNow() : null;
}
