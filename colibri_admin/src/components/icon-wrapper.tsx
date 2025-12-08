import { SidebarRoutesType } from '@/types/types'

export const IconWrapper: React.FC<{ Icon: SidebarRoutesType['icon']; className?: string; size?: number }> = ({
  Icon,
  className = '',
  size = 24,
}) => {
  return <Icon className={className} width={size} height={size} />
}
