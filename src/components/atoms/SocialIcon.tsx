import Link from 'next/link';
import { getPlatformIcon } from '@/utils/detectPlatform';

interface SocialIconProps {
  url: string;
  className?: string;
  iconSize?: number | string;
  iconClass?: string;
  color?: string;
  hoverColor?: string;
}

const SocialIcon = ({
  url,
  className = '',
  iconSize = 24,
  iconClass = '',
  color = 'currentColor',
  hoverColor = 'var(--color-secondary)',
}: SocialIconProps) => {
  const IconComponent = getPlatformIcon(url);

  if (!IconComponent) return null;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} group`}
      style={{ color }}
    >
      <IconComponent
        size={iconSize}
        className={`transition-colors duration-200 group-hover:text-[${hoverColor}] ${iconClass}`}
      />
    </Link>
  );
};

export default SocialIcon;
