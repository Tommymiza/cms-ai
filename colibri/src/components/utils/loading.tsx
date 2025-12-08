import { cn } from '@/lib/cn'

export default function Loading({ className }: { className?: string }) {
  return <div className={cn('loader border-8 border-tweeksy', className)}></div>
}
